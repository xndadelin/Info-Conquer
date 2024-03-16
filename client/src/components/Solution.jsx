import {useParams} from "react-router-dom";
import {gql, useQuery} from "@apollo/client";
import {useContext, useEffect, useState} from "react";
import {Loading} from "./Loading";
import {useNavigate, Link} from "react-router-dom";
import {UserContext} from "../context/UserContext";
import {
    Button,
    Modal, ModalBody, ModalContent,
    ModalHeader, Snippet, Tab,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@nextui-org/react";
import Editor from "@monaco-editor/react";
export const Solution = () => {
    const {id, username} = useParams()
    const [selectedTestCase, setSelectedTestCase] = useState(null);
    const {user} = useContext(UserContext)
    const navigate = useNavigate()
    useEffect(() => {
        if(user && user.getUser.username != username && user.getUser.admin === false){
            navigate(-1);
        }
    }, [user])
    const [solution, setSolution] = useState('')
    const solutionQuery = gql`
        query GetSolution($id: String){
            getSolution(id: $id){
                code
                compilationError
                date
                fileMemory
                id_solution
                io
                language
                problem
                score
                success
                tests {
                  executionTime
                  input
                  memoryUsed
                  score
                  output
                  status
                  success
                }
                username
            }
        }
    `
    const {data, error, loading} = useQuery(solutionQuery, {
        variables: {
            id
        },
        onCompleted: (data) => {
            setSolution(data)
        }
    })
    if(loading || !solution) {
        return <Loading/>
    }
    if(error){
        console.log(error)
    }
    return (
        <div className="container mx-auto grid grid-cols-2 max-lg:grid-cols-1 my-10 p-3 gap-5">
            <div>
                <p className="text-5xl mb-5">Solution for problem: <Link className="text-default-500" to={`/problems/${solution.getSolution.problem}`}>{solution.getSolution.problem}</Link></p>
                <Table>
                    <TableHeader>
                        <TableColumn hidden></TableColumn>
                        <TableColumn hidden></TableColumn>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>Status</TableCell>
                            <TableCell>{solution.getSolution.compilationError ? 'Rejected' : 'Accepted'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>{solution.getSolution.username}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>{new Date(+solution.getSolution.date).toLocaleString()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>File memory</TableCell>
                            <TableCell>{solution.getSolution.fileMemory + ' bytes'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>IO</TableCell>
                            <TableCell>{solution.getSolution.io}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Score</TableCell>
                            <TableCell>{solution.getSolution.score === "100" ? 'Yes' : 'No'}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                {!solution.getSolution.compilationError ? (
                    <div>
                        <p className="text-4xl mt-4 mb-4">Tests summary</p>
                        <Table>
                            <TableHeader>
                                <TableColumn>Test</TableColumn>
                                <TableColumn>Execution time</TableColumn>
                                <TableColumn>Memory used</TableColumn>
                                <TableColumn>Score</TableColumn>
                                <TableColumn>Status</TableColumn>
                                <TableColumn>Test case</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {solution.getSolution.tests.map((test, index) => (
                                    <TableRow>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{test.executionTime + ' ms'}</TableCell>
                                        <TableCell>{test.memoryUsed + ' MB'}</TableCell>
                                        <TableCell>{test.score}</TableCell>
                                        <TableCell>{test.status}</TableCell>
                                        {solution.getSolution.score === "100" ?
                                            <TableCell>
                                                <Button onClick={() => setSelectedTestCase(test)} variant="flat">See test case</Button>
                                            </TableCell>
                                        : <TableCell><p>You do not have 100 points!</p></TableCell>}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ): (
                    <Snippet color="danger" symbol="" className="mt-5">
                        <pre style={{whiteSpace: 'pre-wrap'}}>
                            {solution.getSolution.compilationError}
                        </pre>
                    </Snippet>
                )}
            </div>
            <Modal onClose={() => setSelectedTestCase(null)} isOpen={selectedTestCase !== null}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Test case</ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col justify-between">
                                    <div className="flex flex-col mb-5">
                                        <p className="text-3xl mb-2">Input</p>
                                        <Snippet symbol="">
                                            <pre>
                                                {selectedTestCase.input}
                                            </pre>
                                        </Snippet>
                                    </div>
                                    <div className="flex flex-col mb-5">
                                        <p className="text-3xl mb-2">Output</p>
                                        <Snippet symbol="">
                                            <pre>
                                                {selectedTestCase.output}
                                            </pre>
                                        </Snippet>
                                    </div>
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <div className="h-[100%]">
                <div className="text-4xl mb-3">Submited code</div>
                <Snippet className="w-full" symbol=""> <pre>{solution.getSolution.code}</pre> </Snippet>
            </div>
        </div>
    )
}