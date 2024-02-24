import {useParams} from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import { Loading } from './Loading'
import { Error } from './Error'
import { TableCell, Table, TableHeader, TableRow, TableColumn, TableBody, Snippet, Button, Select, SelectItem, useDisclosure, Modal } from '@nextui-org/react'
import {Editor} from '@monaco-editor/react'
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import {useMutation} from '@apollo/client'
import { TestingSolution } from './TestingSolution'
import {NotFound} from "../pages/NotFound";
import { getTemplate } from '../utils/getLanguageTemplate'
export const Problem = () => {
    const {user} = useContext(UserContext)
    const {isOpen, onOpenChange} = useDisclosure()
    const [language, setLanguage] = useState('')
    const [code, setCode] = useState()
    useEffect(() => {
        setCode(getTemplate(language, problem))
    }, [language])
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
    const {data:problem, loading, error} = useQuery(queryProblem, {
        variables: {
            title: id,
            code: code,
        },
        onError: (error) => {
            console.log(error)
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
    if(error){
        return (
            <Error error={error.message} />
        )
    }
    if(!problem.getProblem || !problem){
        return <NotFound/>
    }
    const onHandleSubmitSolution = () => {
        submitSolution()
    }
    console.log(problem)
    return (
        <div className='container grid grid-cols-2 max-lg:grid-cols-1 mx-auto gap-3 my-5 px-4'>
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
                            <TableColumn>Solved by</TableColumn>
                            <TableColumn>Rating</TableColumn>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>{problem.getProblem.creator}</TableCell>
                                <TableCell>{problem.getProblem.type}</TableCell>
                                <TableCell>{problem.getProblem.difficulty}</TableCell>
                                <TableCell>{problem.getProblem.category}</TableCell>
                                <TableCell>{problem.getProblem.subcategories}</TableCell>
                                <TableCell>69 users</TableCell>
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
            <div className="mt-[85px] max-lg:mt-0">
                {user && user.getUser && (
                    <div className='flex flex-col'>
                        <div className='w-[100%] h-[100%] bg-[#1e1e1e] rounded flex justify-between align-center'>
                            <Select onChange={(e) => setLanguage(e.target.value)} label="Select language" size='sm' className='w-[200px] mt-1 ml-1'>
                                {problem.getProblem.languages.map((language) => (
                                    <SelectItem key={language}>{language}</SelectItem>
                                ))}
                            </Select>
                            <Button className='mt-2 mb-2 mr-2' color='success' variant='flat' onClick={() => {onHandleSubmitSolution(); onOpenChange(); setTests('')}}>Submit solution</Button>
                        </div>
                        <div>
                            <Editor onChange={(val, e) => setCode(val)} value={code} theme='vs-dark' language='cpp' height={'80vh'} />
                        </div>
                        <TestingSolution isOpen={isOpen} onClose={onOpenChange} loading={loadingTests} tests={tests}/>
                    </div>
                )}
            </div>
            </div>
    )
}