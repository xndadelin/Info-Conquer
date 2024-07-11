import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Loading } from '../../components/Miscellaneous/Loading'
import {Button, useDisclosure, Tabs, Tab } from '@nextui-org/react'
import { useCallback, useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useMutation } from '@apollo/client'
import { TestingSolution } from '../../components/Problem/TestingSolution'
import { NotFound } from "../../components/Miscellaneous/NotFound";
import { getTemplate } from '../../utils/getLanguageTemplate'
import { ProblemStats } from '../../components/Problem/ProblemStats'
import { RateProblem } from '../../components/Problem/RateProblem'
import { ReportProblem } from '../../components/Problem/ReportProblem'
import { useTranslation } from 'react-i18next'
import { Card, CardHeader, CardBody } from '@nextui-org/react'
import { ProblemDescription } from '../../components/Problem/ProblemDescription';
import { GET_PROBLEM, GET_SUBMISSIONS, GET_CHATBOT_RESPONSE, SUBMIT_SOLUTION } from '../../utils/Queries';
import { ProblemInfo } from '../../components/Problem/ProblemInfo';
import { ProblemEditor } from '../../components/Problem/ProblemEditor';
import { SubmissionsTable } from '../../components/Problem/SubmissionsTable';
import { UserSolutionsTable } from '../../components/Problem/UserSolutionsTable';

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

    const onChangeLanguage = (language) => {
        setLanguage(language)
        setCode(getTemplate(language))
    }

    const [tests, setTests] = useState('')
    const { id, contest, year, problem_name, month, day } = useParams()
    const type = contest ? `contest:${contest}` : year && month && day && problem_name ? `daily:${year}/${month}/${day}` : 'problem'
    const { t } = useTranslation()
    const { data: submissions, loading: loadingSubmissions } = useQuery(GET_SUBMISSIONS, {
        variables: {
            title: id || problem_name
        },
        onError: (error) => {
            setError(error)
        },
        skip: selected !== 'solutions'
    })
    const [getChatbotMessage, { loading: loadingBot }] = useMutation(GET_CHATBOT_RESPONSE, {
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
    const { data: problem, loading } = useQuery(GET_PROBLEM, {
        variables: {
            title: id || problem_name,
            contest,
            daily: year && month && day && new Date(Date.UTC(year, month - 1, day)).toISOString().replace('Z', '+00:00')
        },
        onError: (error) => {
            setError(error)
        }

    })
    const [submitSolution, { loading: loadingTests }] = useMutation(SUBMIT_SOLUTION, {
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
        <main className="container mx-auto px-5 py-5 0 min-h-screen">
            <Card className="shadow-xl rounded-xl overflow-auto bg-gray-800 pb-5">
                <CardHeader className="bg-gray-700 text-white p-6">
                    <h1 className="text-4xl font-bold">#{problem.getProblem.title}</h1>
                </CardHeader>
                <CardBody>
                    <Tabs
                        size='sm'
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
                            <section className="grid gap-6">
                                <div className="flex flex-col gap-6 rounded-2xl overflow-auto">
                                    <ProblemInfo problem={problem.getProblem} />
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
                                <ProblemEditor user={user} problem={problem} language={language} code={code} onChangeLanguage={onChangeLanguage} onChangeCode={onChangeCode} onHandleSubmitSolution={onHandleSubmitSolution} onOpenChange={onOpenChange} setTests={setTests} getChatbotMessage={getChatbotMessage} loadingBot={loadingBot} prompt={prompt} setPrompt={setPrompt} />
                            </section>
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
                                        <SubmissionsTable submissions={submissions?.getSubmissions?.allSolutions} page={page} setPage={setPage} />

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
                                                <UserSolutionsTable submissions={submissions?.getSubmissions?.userSolutions} userPage={userPage} setUserPage={setUserPage} />
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
        </main>
    )
}