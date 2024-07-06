import { Link, useParams } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import { Loading } from './Loading'
import { TableCell, Table, TableHeader, TableRow, TableColumn, TableBody, Snippet, Button, Select, SelectItem, useDisclosure, Tabs, Tab, Tooltip, Input, Textarea, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react'
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useMutation } from '@apollo/client'
import { TestingSolution } from './TestingSolution'
import { NotFound } from "../pages/NotFound";
import { getTemplate } from '../utils/getLanguageTemplate'
import { Pagination } from '@nextui-org/react'
import { ProblemStats } from './ProblemStats'
import { RateProblem } from './RateProblem'
import { ReportProblem } from './ReportProblem'
import { useTranslation } from 'react-i18next'
import { Chip } from '@nextui-org/react'
import { getStatusColor } from '../utils/getStatusColor'
import { Card, CardHeader, CardBody } from '@nextui-org/react'

import CodeMirror from '@uiw/react-codemirror';

import { oneDark } from '@codemirror/theme-one-dark';
import { loadLanguage } from '@uiw/codemirror-extensions-langs'
import { ProblemDescription } from './ProblemDescription';

const placeholder = `#include <iostream>
#include <cstring>
#include <string>
#include <fstream>
#include <cmath>
using namespace std;

ifstream in("caesar.in");
ofstream out("dbftbs.out");

char alfabet[] = "abcdefghijklmnopqrstuvwxyz";

int cautachar(char c) {
    char cp = tolower(c);
    for (int i = 0; i < strlen(alfabet); ++i) {
        if (alfabet[i] == cp) {
            return i;
        }
    }
    return 0;
}

void encrypt(char text[], int cheie) {
    char cipher[257] = "";
    int cnt = 0;
    for (int i = 0; i < strlen(text); ++i) {
        if (isalpha(text[i])) {
            if (islower(text[i])) {
                cipher[cnt++] = alfabet[(cautachar(text[i]) + cheie) % 26];
            } else {
                cipher[cnt++] = (alfabet[(cautachar(text[i]) + cheie) % 26] - 32);
            }
        } else {
            cipher[cnt++] = text[i];
        }
    }
    out << cipher;
}

void decrypt(char text[], int cheie) {
    char plain[257] = "";
    int cnt = 0;
    for (int i = 0; i < strlen(text); ++i) {
        if (isalpha(text[i])) {
            if (islower(text[i])) {
                plain[cnt++] = alfabet[(cautachar(text[i]) - cheie + 26) % 26];
            } else {
                plain[cnt++] = toupper(alfabet[(cautachar(text[i]) - cheie + 26) % 26]);
            }
        } else {
            plain[cnt++] = text[i];
        }
    }
    out << plain;
}


int main() {
    char text[257];
    in.getline(text, 257);
    int cheie;
    in >> cheie;
    in.ignore();
    char operatie[20];
    in.getline(operatie, 20);
    if (strcmp(operatie, "encrypt") == 0) {
        encrypt(text, cheie);
    } else {
        decrypt(text, cheie);
    }
    return 0;
}
`
const languages_for_editor = {
    'C++': 'cpp',
    'Python': 'python',
    'Java': 'java',
    'Javascript': 'javascript',
    'C#': 'csharp',
    'C': 'c',
    'Rust': 'rust',
    'PHP': 'php',
}
export const Problem = () => {
    const { user } = useContext(UserContext)
    const { code: userCode, language: userLanguage } = Object.fromEntries(new URLSearchParams(window.location.search))
    const [selected, setSelected] = useState('problem')
    const [page, setPage] = useState(1)
    const { isOpen, onOpenChange } = useDisclosure()
    const [language, setLanguage] = useState(userLanguage || 'C++')
    const [code, setCode] = useState(userCode || getTemplate(language))
    const [error, setError] = useState()
    const [prompt, setPrompt] = useState('')
    const [clickRate, setClickRate] = useState(false)
    const [clickReport, setClickReport] = useState(false)
    const [userHasRated, setUserHasRated] = useState(false)
    const [userPage, setUserPage] = useState(1)

    const onChangeCode = useCallback((val) => {
        setCode(val)
    })

    useEffect(() => {
        setCode(getTemplate(language))
    }, [language])

    const [tests, setTests] = useState('')
    const { id, contest, year, problem_name, month, day } = useParams()
    const type = contest ? `contest:${contest}` : year && month && day && problem_name ? `daily:${year}/${month}/${day}` : 'problem'
    const { t } = useTranslation()
    const queryProblem = gql`
        query GetProblem($title: String!, $contest: String, $daily: Date) {
            getProblem(title: $title, contest: $contest, daily: $daily) {
                title
                creator
                description
                requirements
                tags
                category
                difficulty
                subcategories
                input
                output
                timeExecution
                limitMemory
                examples {
                    input
                    explanation
                    output
                }
                indications
                languages
                restriction
                successRate
                userHasRated
                rating
                contest
            }
        }
    `
    const solutionMutation = gql`
        mutation ($solutionInput: SolutionInput) {
            submitSolution(solutionInput: $solutionInput) {
                username
                code
                language
                problem
                io
                score
                tests {
                    success
                    status
                    memoryUsed
                    executionTime
                    score
                    input
                    output
                    message
                    exitcode
                    exitsig
                }
                date
                fileMemory
                compilationError
                success
                id_solution
            }
        }
    `
    const submissiongql = gql`
        query GetSubmissions($title: String) {
            getSubmissions(title: $title) {
                allSolutions {
                    status
                    date
                    language
                    problem
                    score
                    username
                    status
                }
                userSolutions {
                    status
                    date
                    language
                    problem
                    score
                    username
                    _id
                }
            }
        }
    `
    const chatbotgql = gql`
        mutation GetChatbotMessage($prompt: String, $problem: String, $code: String) {
            getChatbotMessage(prompt: $prompt, problem: $problem, code: $code) {
                message
            }
        }
    `
    const { data: submissions, loading: loadingSubmissions, error: errorSubmissions } = useQuery(submissiongql, {
        variables: {
            title: id || problem_name
        },
        onError: (error) => {
            setError(error)
        },
        skip: selected !== 'solutions'
    })
    const [getChatbotMessage, { loading: loadingBot, errorBot }] = useMutation(chatbotgql, {
        onCompleted: (data) => {
            setCode(data.getChatbotMessage.message)
        },
        onError: (error) => {
            console.log(error)
        },
        variables: {
            prompt,
            problem: id,
            code
        }
    })
    const { data: problem, loading } = useQuery(queryProblem, {
        variables: {
            title: id || problem_name,
            contest,
            daily: year && month && day && new Date(Date.UTC(year, month - 1, day)).toISOString().replace('Z', '+00:00')
        },
        onError: (error) => {
            setError(error)
        }

    })
    const [submitSolution, { error: errorSolution, loading: loadingTests }] = useMutation(solutionMutation, {
        variables: {
            solutionInput: {
                code: code,
                problem: problem?.getProblem?.title,
                language,
                type
            }
        },
        onCompleted: (data) => {
            setTests(data.submitSolution)
        }
    })
    if (loading) {
        return (
            <Loading />
        )
    }
    if (!problem || !problem.getProblem || error) return <NotFound />
    const onHandleSubmitSolution = () => {
        submitSolution()
    }
    const onClickRate = () => {
        setClickRate(!clickRate)
    }
    const onClickReport = () => {
        setClickReport(!clickReport)
    }
    return (
        <div className="container mx-auto px-5 py-5 0 min-h-screen">
            <Card className="shadow-xl rounded-xl overflow-hidden bg-gray-800 pb-5">
                <CardHeader className="bg-gray-700 text-white p-6">
                    <h1 className="text-4xl font-bold">#{problem.getProblem.title}</h1>
                </CardHeader>
                <CardBody>
                    <Tabs
                        selectedKey={selected}
                        onSelectionChange={setSelected}
                        variant="underlined"
                        classNames={{
                            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                            cursor: "w-full bg-blue-500",
                            tab: "max-w-fit px-0 h-12",
                            tabContent: "group-data-[selected=true]:text-blue-500",
                        }}
                    >
                        <Tab
                            key="problem"
                            className='overflow-hidden'
                            title={
                                <div className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                    <span>{t('tabs.problem')}</span>
                                </div>
                            }
                        >
                            <div className="grid gap-6">
                                <div className="flex flex-col gap-6 rounded-2xl">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-900 rounded-lg">
                                        {[
                                            { key: 'creator', icon: '👤', value: problem.getProblem.creator },
                                            { key: 'difficulty', icon: '🏋️', value: problem.getProblem.difficulty },
                                            { key: 'category', icon: '📚', value: problem.getProblem.category },
                                            { key: 'subcategory', icon: '🏷️', value: <div className='flex gap-2'>
                                                {problem.getProblem.subcategories.map((subcategory) => (
                                                    <Chip color='primary' className='text-xs'>{t(`problems.subcategories.${subcategory}`)}</Chip>
                                                ))}
                                            </div> },
                                            { key: 'timeLimit', icon: '⏱️', value: `${problem.getProblem.timeExecution} s` },
                                            { key: 'memoryLimit', icon: '💾', value: `${Math.ceil(problem.getProblem.limitMemory / 1024)} MB` },
                                            { key: 'solveRate', icon: '📊', value: `${parseInt(problem.getProblem.successRate)}%` },
                                            { key: 'rating', icon: '⭐', value: problem.getProblem.rating === 0 ? 'NR' : `${parseFloat(problem.getProblem.rating).toFixed(2)} / 5` },
                                        ].map((row) => (
                                            <div key={row.key} className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                            <div className="flex items-center mb-2">
                                                <span className="text-2xl mr-2">{row.icon}</span>
                                                <h3 className="text-gray-400 font-medium uppercase tracking-wider">
                                                {t(`problem.${row.key}`)}
                                                </h3>
                                            </div>
                                            <p className="text-gray-200 text-lg">
                                                {row.key === 'category' ? t(`problems.categories.${row.value}`) :
                                                row.key === 'subcategory' ? row.value :
                                                row.value}
                                            </p>
                                            </div>
                                        ))}
                                    </div>
                                    {user && user.getUser && (
                                        <div className='flex gap-3 mt-2 max-sm:flex-col max-sm:h-[150px]'>
                                            <Button color='success' variant='flat' className='flex-1' isDisabled={problem.getProblem.userHasRated || userHasRated} onClick={onClickRate}>
                                                {t('problem.rate')}
                                            </Button>
                                            <Button color='warning' variant='flat' className='flex-1' onClick={onClickReport}>
                                                {t('problem.report')}
                                            </Button>
                                            <Button color='default' variant='flat' className='flex-1' onClick={() => {
                                                navigator.clipboard.writeText(window.location.href)
                                            }}>
                                                {t('problem.share')}
                                            </Button>
                                        </div>
                                    )}
                                    <ProblemDescription problem={problem} t={t} />
                                </div>
                                {user?.getUser ? (
                                    <div>
                                        <div className="flex justify-between items-center bg-[#1e1e1e] rounded-tl-2xl rounded-tr-2xl">
                                            <Select
                                                defaultSelectedKeys={[language]}
                                                onChange={(e) => setLanguage(e.target.value)}
                                                label={t('problem.selectLanguage')}
                                                className="w-48"
                                            >
                                                {problem.getProblem.languages.map((lang) => (
                                                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                                                ))}
                                            </Select>
                                            <div className="flex gap-2">
                                                <Tooltip size='sm' closeDelay={1000} color='warning' placement="left" content={
                                                    <div>
                                                        <p>{t('problem.chatGPT')}</p>
                                                        <p>{t('problem.chatGPTNote')}</p>
                                                        <Textarea onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    getChatbotMessage()
                                                                    setPrompt('')
                                                                }
                                                            }} endContent={
                                                                <Button isLoading={loadingBot} disabled={!prompt} color='warning' className='self-end text-2xl' size='sm' variant='flat' onClick={() => getChatbotMessage()}>↑</Button>
                                                        } onChange={(e) => setPrompt(e.target.value)} value={prompt} label={t('problem.prompt')} />
                                                    </div>
                                                }>
                                                    <Button isLoading={loadingBot} className='mt-2 mb-2 mr-2' color='warning' variant='flat'>🤖</Button>
                                                </Tooltip>
                                                <Tooltip color='danger' content={t('problem.runCode')}>
                                                    <Button className="mt-2 mb-2 mr-2" color='danger' disabled={!language || !code || !user || !user.getUser} variant='flat' onClick={() => { onHandleSubmitSolution(); onOpenChange(); setTests('') }}>{t('problem.submit')}</Button>
                                                </Tooltip>
                                            </div>
                                        </div>
                                        <CodeMirror
                                            value={code}
                                            theme={oneDark}
                                            extensions={[loadLanguage(languages_for_editor[language] || 'markdown')]}
                                            onChange={onChangeCode}
                                            height="700px"
                                        />
                                    </div>
                                ): (
                                    <div>
                                        <CodeMirror
                                            value={placeholder}
                                            theme={oneDark}
                                            extensions={[loadLanguage(languages_for_editor[language] || 'markdown')]}
                                            className="rounded-md overflow-hidden blur-sm"
                                            readOnly
                                            height="100%"
                                        />
                                    </div>
                                )}
                            </div>
                        </Tab>

                        <Tab key="solutions" title={
                            <div className="flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                                <span>{t('tabs.solutions')}</span>
                            </div>
                        }>
                            {submissions && (
                                <Tabs color='primary' variant='bordered'>
                                    <Tab key="all" title={
                                        <div className="flex items-center space-x-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 8.586l-2.293-2.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z" clipRule="evenodd" />
                                            </svg>
                                            <span>{t('submissions.all_submissions')}</span>
                                        </div>
                                    }>
                                        <table className="w-full text-sm text-gray-300 border-collapse shadow-2xl" aria-label="All submissions">
                                            <thead className="bg-gray-800">
                                            <tr>
                                                <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('submissions.username')}</th>
                                                <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('submissions.language')}</th>
                                                <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('submissions.score')}</th>
                                                <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('submissions.date')}</th>
                                                <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('submissions.status')}</th>
                                            </tr>
                                            </thead>
                                            <tbody className="bg-gray-900 divide-y divide-gray-700">
                                            {submissions.getSubmissions.allSolutions.slice((page - 1) * 20, page * 20).map((submission, index) => (
                                                <tr className={index % 2 === 1 ? 'bg-gray-800' : 'bg-gray-900'}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Link to={`/profile/${submission.username}`} className="text-blue-300 hover:text-blue-200 transition-colors">
                                                            {submission.username}
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{submission.language}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{submission.score}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(+submission.date).toLocaleString()}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Chip className={`px-2 py-1 text-xs font-medium rounded-full`} color={getStatusColor(submission.status)}>
                                                            {submission.status}
                                                        </Chip>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                        <Pagination
                                            total={Math.ceil(submissions.getSubmissions.allSolutions.length / 20)}
                                            page={page}
                                            onChange={setPage}
                                            className='mt-5'
                                            showControls
                                            loop
                                        />

                                    </Tab>
                                        {submissions?.getSubmissions?.userSolutions?.length > 0 && (
                                            <Tab key="user" title={
                                                <div className="flex items-center space-x-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 8.586l-2.293-2.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>{t('submissions.ur_submissions')}</span>
                                                </div>
                                            }>
                                                <table className="w-full text-sm text-gray-300 border-collapse shadow-2xl" aria-label="User submissions">
                                                    <thead className="bg-gray-800">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('submissions.seeSolution')}</th>
                                                        <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('submissions.language')}</th>
                                                        <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('submissions.score')}</th>
                                                        <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('submissions.date')}</th>
                                                        <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('submissions.status')}</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody className="bg-gray-900 divide-y divide-gray-700">
                                                    {submissions.getSubmissions.userSolutions.slice((userPage - 1) * 20, userPage * 20).map((submission, index) => (
                                                        <tr className={index % 2 === 1 ? 'bg-gray-800' : 'bg-gray-900'}>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <Link to={`/solution/${submission.username}/${submission._id}`} className="text-blue-300 hover:text-blue-200 transition-colors">
                                                                    See solution
                                                                </Link>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">{submission.language}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap">{submission.score}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap">{new Date(+submission.date).toLocaleString()}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <Chip className={`px-2 py-1 text-xs font-medium rounded-full`} color={getStatusColor(submission.status)}>
                                                                    {submission.status}
                                                                </Chip>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                                <Pagination
                                                    color='primary'
                                                    className="mt-4"
                                                    onChange={(page) => setUserPage(page)}
                                                    total={Math.ceil(submissions.getSubmissions.userSolutions.length / 20)}
                                                    initialPage={1}
                                                    showControls
                                                    loop
                                                />
                                        </Tab>
                                        )}
                                </Tabs>
                            )}
                            {loadingSubmissions && <Loading />}
                        </Tab>

                        <Tab key="insights" title={
                            <div className="flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>{t('tabs.insights')}</span>
                            </div>
                        }>
                            <ProblemStats />
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>

            {clickRate && (
                <RateProblem isOpen={clickRate} setUserHasRated={setUserHasRated} onClose={onClickRate} problem={problem.getProblem} user={user} />
            )}
            {clickReport && (
                <ReportProblem isOpen={clickReport} onClose={onClickReport} problem={problem.getProblem} user={user} />
            )}
            <TestingSolution isOpen={isOpen} onClose={onOpenChange} loading={loadingTests} tests={tests} />
        </div>
    )
}