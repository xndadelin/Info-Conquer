import {Link, useParams} from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import { Loading } from './Loading'
import { TableCell, Table, TableHeader, TableRow, TableColumn, TableBody, Snippet, Button, Select, SelectItem, useDisclosure, Tabs, Tab, Tooltip, Input, Textarea } from '@nextui-org/react'
import {Editor} from '@monaco-editor/react'
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import {useMutation} from '@apollo/client'
import { TestingSolution } from './TestingSolution'
import {NotFound} from "../pages/NotFound";
import { getTemplate } from '../utils/getLanguageTemplate'
import {Pagination} from '@nextui-org/react'
import { ProblemStats } from './ProblemStats'
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
    'C#': 'csharp',
    'C': 'c',
}
export const Problem = () => {
    const {user} = useContext(UserContext)
    const {code: userCode, language: userLanguage} = Object.fromEntries(new URLSearchParams(window.location.search))
    const [selected, setSelected] = useState('problem')
    const [page, setPage] = useState(1)
    const {isOpen, onOpenChange} = useDisclosure()
    const [language, setLanguage] = useState(userLanguage || 'cpp')
    const [code, setCode] = useState(userCode || '')
    const [error, setError] = useState()
    const [prompt, setPrompt] = useState('')
    useEffect(() => {
        setCode(getTemplate(language, problem))
    }, [language])
    useEffect(() => {
        const {code: userCode, language: userLanguage} = Object.fromEntries(new URLSearchParams(window.location.search))
        setCode(userCode)
        setLanguage(userLanguage)
    }, [])
    const [tests, setTests] = useState('')
    const {id} = useParams()
    const queryProblem = gql`
        query GetProblem($title: String!) {
            getProblem(title: $title) {
                title
                creator
                description
                requirements
                type
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
                compilationError
                date
                language
                problem
                score
                username
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
    const {data: submissions, loading: loadingSubmissions, error: errorSubmissions} = useQuery(submissiongql, {
        variables: {
            title: id
        },
        onError: (error) => {
            setError(error)
        },
        skip: selected !== 'solutions'
    })
    const [getChatbotMessage, {loading:loadingBot, errorBot}] = useMutation(chatbotgql, {
        onCompleted: (data) => {
            console.log(data.getChatbotMessage.message)
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
    const {data:problem, loading} = useQuery(queryProblem, {
        variables: {
            title: id,
            code: code,
        },
        onError: (error) => {
            setError(error)
        }

    })
    const [submitSolution, {error: errorSolution, loading: loadingTests}] = useMutation(solutionMutation, {
        variables: {
            solutionInput: {
                code: code,
                problem: problem && problem.getProblem && problem.getProblem.title,
                language
            }
        },
        onCompleted: (data) => {
            setTests(data.submitSolution)
        }
    })
    if(loading){
        return (
            <Loading/>
        )
    }
    if(!problem || !problem.getProblem || error) return <NotFound/>
    const onHandleSubmitSolution = () => {
        submitSolution()
    }
    return (
        <div className="container mx-auto px-5 py-5">
            <Tabs selectedKey={selected} onSelectionChange={setSelected} className="flex flex-col">
                <Tab key="problem" title="Problem">
                    <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-3">
                        <div className="flex flex-col gap-2">
                            <p className='font-bold text-6xl'>
                                #{problem.getProblem.title}
                            </p>
                            <div className='mt-4'>
                                <Table>
                                    <TableHeader>
                                        <TableColumn>Creator</TableColumn>
                                        <TableColumn>Type</TableColumn>
                                        <TableColumn>Difficulty</TableColumn>
                                        <TableColumn>Category</TableColumn>
                                        <TableColumn>Subcategory</TableColumn>
                                        <TableColumn>Solve rate</TableColumn>
                                        <TableColumn>Rating</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{problem.getProblem.creator}</TableCell>
                                            <TableCell>{problem.getProblem.type}</TableCell>
                                            <TableCell>{problem.getProblem.difficulty}</TableCell>
                                            <TableCell>{problem.getProblem.category}</TableCell>
                                            <TableCell>{problem.getProblem.subcategories}</TableCell>
                                            <TableCell>{parseInt(problem.getProblem.successRate) + '%'}</TableCell>
                                            <TableCell>69%</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                            {problem.getProblem.description && (
                                <div>
                                    <p className='font-bold text-3xl mb-2'>Description</p>
                                    <p className='text-1xl' dangerouslySetInnerHTML={{__html: problem.getProblem.description}}></p>
                                </div>
                            )}
                            {problem.getProblem.requirements && (
                                <div>
                                    <p className='font-bold text-3xl mb-2'>Requirements</p>
                                    <p className='text-1xl' dangerouslySetInnerHTML={{__html: problem.getProblem.requirements}}></p>
                                </div>
                            )}
                            {problem.getProblem.input && (
                                <div>
                                    <p className='font-bold text-3xl mb-2'>Input</p>
                                    <p className='text-1xl' dangerouslySetInnerHTML={{__html: problem.getProblem.input}}></p>
                                </div>
                            )}
                            {problem.getProblem.output && (
                                <div>
                                    <p className='font-bold text-3xl mb-2'>Output</p>
                                    <p className='text-1xl' dangerouslySetInnerHTML={{__html: problem.getProblem.output}}></p>
                                </div>
                            )}
                            {problem.getProblem.examples && (
                                <div>
                                    {problem.getProblem.examples.map((example, index) => (
                                        <div className='flex flex-col gap-1'>
                                            <p className='font-bold text-3xl'>Example {index + 1}</p>
                                            <p className='font-bold text-xl'>Input</p>
                                            <Snippet symbol="">
                                                <pre>
                                                    {example.input}
                                                </pre>
                                            </Snippet>
                                            <p className='font-bold text-xl'>Output</p>
                                            <Snippet symbol="">
                                                <pre>
                                                    {example.output}
                                                </pre>
                                            </Snippet>
                                            {example.explanation && (
                                                <>
                                                    <p className='font-bold text-xl'>Explanation</p>
                                                    <Snippet dangerouslySetInnerHTML={{__html: example.output}} symbol=""></Snippet>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {problem.getProblem.restriction && (
                                <div>
                                    <p className='font-bold text-3xl mb-2'>Restrictions</p>
                                    <p className='text-1xl' dangerouslySetInnerHTML={{__html: problem.getProblem.restriction}}></p>
                                </div>
                            )}
                        </div>
                        {user && user.getUser ? (
                            <div className="mt-[85px] max-lg:mt-0">
                                <div className='flex flex-col'>
                                    <div className='w-[100%] h-[100%] bg-[#1e1e1e] rounded flex justify-between align-center'>
                                        <Select defaultSelectedKeys={[ language ]} onChange={(e) => setLanguage(e.target.value)} label="Select language" size='sm' className='w-[150px] mt-1 ml-1'>
                                            {problem.getProblem.languages.map((language) => (
                                                <SelectItem key={language}>{language}</SelectItem>
                                            ))}
                                        </Select>
                                        <div className='flex items-center gap-1'>
                                            <Tooltip size='sm' closeDelay={1000} color='warning' placement='bottom-end' content={
                                                <div>
                                                    <p>ChatGPT 4. Please do not abuse of this or else you get the wrath of Savitar!</p>
                                                    <p>Do not send pieces of code. It will automatically be sent! As well the problem.</p>
                                                    <Textarea endContent={
                                                        <Button isLoading={loadingBot} disabled={!prompt} color='warning' className='self-end text-2xl' size='sm' variant='flat' onClick={() => getChatbotMessage()}>↑</Button>
                                                    } onChange={(e) => setPrompt(e.target.value)} value={prompt} label='Type your prompt here' />
                                                </div>
                                            }>
                                                <Button isLoading={loadingBot} className='mt-2 mb-2 mr-2' color='warning' variant='flat'>🤖</Button>
                                            </Tooltip>
                                            <Tooltip color='danger' content='Run your code!'>
                                                <Button className='mt-2 mb-2 mr-2' color='danger' disabled={!language || !code || !user || !user.getUser} variant='flat' onClick={() => {onHandleSubmitSolution(); onOpenChange(); setTests('')}}>Submit solution</Button>
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
                                    <TestingSolution isOpen={isOpen} onClose={onOpenChange} loading={loadingTests} tests={tests}/>
                                </div>
                            </div>
                        ): (
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
                                        You need to be logged in to submit a solution!
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Tab>
                <Tab key="solutions" title="Submissions">
                    {submissions && (
                        <>
                            <Table isStriped>
                                <TableHeader>
                                    <TableColumn>Username</TableColumn>
                                    <TableColumn>Language</TableColumn>
                                    <TableColumn>Score</TableColumn>
                                    <TableColumn>Date</TableColumn>
                                    <TableColumn>Status</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {submissions.getSubmissions.slice((page - 1)*20, page*20).map((submission) => (
                                        <TableRow>
                                            <TableCell>
                                                <Link to={`/profile/${submission.username}`}>
                                                    {submission.username}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{submission.language}</TableCell>
                                            <TableCell>{submission.score}</TableCell>
                                            <TableCell>{new Date(+submission.date).toLocaleString()}</TableCell>
                                            <TableCell>{submission.score === "100" ? 'Accepted': 'Rejected'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Pagination className="mt-2" onChange={(page) => setPage(page)} loop showControls total={Math.ceil(submissions.getSubmissions.length/20)} initialPage={1}></Pagination>
                        </>
                    )}
                    {loadingSubmissions && (
                        <Loading/>
                    )}
                </Tab>
                <Tab key="insights" title="Insights">
                    <ProblemStats/>
                </Tab>
            </Tabs>
            </div>
    )
}