import { Link, useParams } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import { Loading } from './Loading'
import { TableCell, Table, TableHeader, TableRow, TableColumn, TableBody, Snippet, Button, Select, SelectItem, useDisclosure, Tabs, Tab, Tooltip, Input, Textarea, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react'
import { Editor } from '@monaco-editor/react'
import { useContext, useEffect, useState } from "react";
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
    'Javascript': 'js',
    'C#': 'cs',
    'C': 'c',
    'Rust': 'rs'
}
export const Problem = () => {
    const { user } = useContext(UserContext)
    const { code: userCode, language: userLanguage } = Object.fromEntries(new URLSearchParams(window.location.search))
    const [selected, setSelected] = useState('problem')
    const [page, setPage] = useState(1)
    const { isOpen, onOpenChange } = useDisclosure()
    const [language, setLanguage] = useState(userLanguage || 'cpp')
    const [code, setCode] = useState(userCode || '')
    const [error, setError] = useState()
    const [prompt, setPrompt] = useState('')
    const [clickRate, setClickRate] = useState(false)
    const [clickReport, setClickReport] = useState(false)
    const [userHasRated, setUserHasRated] = useState(false)
    const [userPage, setUserPage] = useState(1)
    useEffect(() => {
        setCode(getTemplate(language, problem))
    }, [language])
    useEffect(() => {
        const { code: userCode, language: userLanguage } = Object.fromEntries(new URLSearchParams(window.location.search))
        setCode(userCode)
        setLanguage(userLanguage)
    }, [])
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
        <div className="container mx-auto px-5 py-5">
            <Tabs selectedKey={selected} onSelectionChange={setSelected} className="flex flex-col">
                <Tab key="problem" title={t('tabs.problem')}>
                    <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-3">
                        <div className="flex flex-col gap-2">
                            <p className='font-bold text-6xl'>
                                #{problem.getProblem.title}
                            </p>
                            <div className='mt-4'>
                                <Table isCompact>
                                    <TableHeader>
                                        <TableColumn>{t('problem.creator')}</TableColumn>
                                        <TableColumn>{t('problem.difficulty')}</TableColumn>
                                        <TableColumn>{t('problem.category')}</TableColumn>
                                        <TableColumn>{t('problem.subcategory')}</TableColumn>
                                        <TableColumn>{t('problem.timeLimit')}</TableColumn>
                                        <TableColumn>{t('problem.memoryLimit')}</TableColumn>
                                        <TableColumn>{t('problem.solveRate')}</TableColumn>
                                        <TableColumn>{t('problem.rating')}</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{problem.getProblem.creator}</TableCell>
                                            <TableCell>{problem.getProblem.difficulty}</TableCell>
                                            <TableCell>{t(`problems.categories.${problem.getProblem.category}`)}</TableCell>
                                            <TableCell>{t(`problems.subcategories.${problem.getProblem.subcategories}`)}</TableCell>
                                            <TableCell>{problem.getProblem.timeExecution} s</TableCell>
                                            <TableCell>{Math.ceil(problem.getProblem.limitMemory / 1024)} MB</TableCell>
                                            <TableCell>{parseInt(problem.getProblem.successRate) + '%'}</TableCell>
                                            <TableCell>{problem.getProblem.rating === 0 ? 'NR' : problem.getProblem.rating} / 5</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
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
                            </div>
                            {problem.getProblem.description && (
                                <div>
                                    <p className='font-bold text-3xl mb-2'>{t('problem.description')}</p>
                                    <p className='text-1xl' dangerouslySetInnerHTML={{ __html: problem.getProblem.description }}></p>
                                </div>
                            )}
                            {problem.getProblem.requirements && (
                                <div>
                                    <p className='font-bold text-3xl mb-2'>{t('problem.requirements')}</p>
                                    <p className='text-1xl' dangerouslySetInnerHTML={{ __html: problem.getProblem.requirements }}></p>
                                </div>
                            )}
                            {problem.getProblem.input && (
                                <div>
                                    <p className='font-bold text-3xl mb-2'>{t('problem.input')}</p>
                                    <p className='text-1xl' dangerouslySetInnerHTML={{ __html: problem.getProblem.input }}></p>
                                </div>
                            )}
                            {problem.getProblem.output && (
                                <div>
                                    <p className='font-bold text-3xl mb-2'>{t('problem.output')}</p>
                                    <p className='text-1xl' dangerouslySetInnerHTML={{ __html: problem.getProblem.output }}></p>
                                </div>
                            )}
                            {problem.getProblem.examples && (
                                <div>
                                    {problem.getProblem.examples.map((example, index) => (
                                        <div className='flex flex-col gap-1' key={index}>
                                            <p className='font-bold text-3xl'>{t('problem.example')} {index + 1}</p>
                                            <p className='font-bold text-xl'>{t('problem.input')}</p>
                                            <Snippet symbol="">
                                                <pre>
                                                    {example.input}
                                                </pre>
                                            </Snippet>
                                            <p className='font-bold text-xl'>{t('problem.output')}</p>
                                            <Snippet symbol="">
                                                <pre>
                                                    {example.output}
                                                </pre>
                                            </Snippet>
                                            {example.explanation && (
                                                <>
                                                    <p className='font-bold text-xl'>{t('problem.explanation')}</p>
                                                    <Snippet dangerouslySetInnerHTML={{ __html: example.explanation }} symbol=""></Snippet>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {problem.getProblem.restriction && (
                                <div>
                                    <p className='font-bold text-3xl'>{t('problem.restrictions')}</p>
                                    <div className='ml-5' dangerouslySetInnerHTML={{ __html: problem.getProblem.restriction }}></div>
                                </div>
                            )}
                        </div>
                        {user && user.getUser ? (
                            <div className="mt-[85px] max-lg:mt-0">
                                <div className='flex flex-col'>
                                    <div className='w-[100%] h-[100%] bg-[#1e1e1e] rounded flex justify-between align-center'>
                                        <Select defaultSelectedKeys={[language]} onChange={(e) => setLanguage(e.target.value)} label={t('problem.selectLanguage')} size='sm' className='w-[150px] mt-1 ml-1'>
                                            {problem.getProblem.languages.map((lang) => (
                                                <SelectItem key={lang}>{lang}</SelectItem>
                                            ))}
                                        </Select>
                                        <div className='flex items-center gap-1'>
                                            <Tooltip size='sm' closeDelay={1000} color='warning' placement="left" content={
                                                <div>
                                                    <p>{t('problem.chatGPT')}</p>
                                                    <p>{t('problem.chatGPTNote')}</p>
                                                    <Textarea endContent={
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
                                    <div>
                                        <Editor options={{
                                            minimap: {
                                                enabled: false
                                            },
                                        }} language={languages_for_editor[language]} onChange={(val, e) => setCode(val)} value={code} theme='vs-dark' height={'80vh'} />
                                    </div>
                                    <TestingSolution isOpen={isOpen} onClose={onOpenChange} loading={loadingTests} tests={tests} />
                                </div>
                            </div>
                        ) : (
                            <div className="h-[100%] flex justify-center items-center relative">
                                <Editor
                                    options={{
                                        readOnly: true,
                                        minimap: {
                                            enabled: false
                                        },
                                        scrollbar: {
                                            vertical: 'hidden',
                                            horizontal: 'hidden'
                                        },
                                    }}
                                    className='blur-md'
                                    height={'100vh'}
                                    value={placeholder}
                                    theme='vs-dark'
                                    language='cpp'
                                />
                                <div className='z-10 absolute'>
                                    <div className='text-center font-bold text-xl'>
                                        {t('problem.loginToSubmit')}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {clickRate && (
                        <RateProblem isOpen={clickRate} setUserHasRated={setUserHasRated} onClose={onClickRate} problem={problem.getProblem} user={user} />
                    )}
                    {clickReport && (
                        <ReportProblem isOpen={clickReport} onClose={onClickReport} problem={problem.getProblem} user={user} />
                    )}
                </Tab>
                <Tab key="solutions" title={t('tabs.solutions')}>
                    {submissions && (
                        <>
                            <Tabs>
                                <Tab key="all" title={t('submissions.all_submissions')}>
                                    <Table isStriped>
                                        <TableHeader>
                                            <TableColumn>{t('submissions.username')}</TableColumn>
                                            <TableColumn>{t('submissions.language')}</TableColumn>
                                            <TableColumn>{t('submissions.score')}</TableColumn>
                                            <TableColumn>{t('submissions.date')}</TableColumn>
                                            <TableColumn>{t('submissions.status')}</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                            {submissions.getSubmissions.allSolutions.slice((page - 1) * 20, page * 20).map((submission, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Link to={`/profile/${submission.username}`}>
                                                            {submission.username}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>{submission.language}</TableCell>
                                                    <TableCell>{submission.score}</TableCell>
                                                    <TableCell>{new Date(+submission.date).toLocaleString()}</TableCell>
                                                    <TableCell>{submission.status}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <Pagination color='danger' className="mt-2" onChange={(page) => setPage(page)} loop showControls total={Math.ceil(submissions.getSubmissions.allSolutions.length / 20)} initialPage={1}></Pagination>
                                </Tab>
                                <Tab key="user" title={t('submissions.ur_submissions')}>
                                    <Table isStriped>
                                        <TableHeader>
                                            <TableColumn>{t('profile.see_solution')}</TableColumn>
                                            <TableColumn>{t('submissions.username')}</TableColumn>
                                            <TableColumn>{t('submissions.language')}</TableColumn>
                                            <TableColumn>{t('submissions.score')}</TableColumn>
                                            <TableColumn>{t('submissions.date')}</TableColumn>
                                            <TableColumn>{t('submissions.status')}</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                            {submissions.getSubmissions.userSolutions.slice((userPage - 1) * 20, userPage * 20).map((submission, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Link to={`/solution/${user.getUser.username}/${submission._id}`}>{t('profile.see_solution')}</Link>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Link to={`/profile/${submission.username}`}>
                                                            {submission.username}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>{submission.language}</TableCell>
                                                    <TableCell>{submission.score}</TableCell>
                                                    <TableCell>{new Date(+submission.date).toLocaleString()}</TableCell>
                                                    <TableCell>{submission.status}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <Pagination color='danger' className="mt-2" onChange={(page) => setUserPage(page)} loop showControls total={Math.ceil(submissions.getSubmissions.userSolutions.length / 20)} initialPage={1}></Pagination>
                                </Tab>
                            </Tabs>
                        </>
                    )}
                    {loadingSubmissions && (
                        <Loading />
                    )}
                </Tab>
                <Tab key="insights" title={t('tabs.insights')}>
                    <ProblemStats />
                </Tab>
            </Tabs>
        </div>
    )
}