import {useParams} from "react-router-dom";
import {gql, useQuery} from "@apollo/client";
import {useContext, useEffect, useState} from "react";
import {Loading} from "./Loading";
import {useNavigate, Link} from "react-router-dom";
import {UserContext} from "../context/UserContext";
import {Modal, ModalBody, ModalContent, ModalHeader, Table, TableCell, TableRow, TableColumn, TableHeader, Snippet, Button, TableBody, code} from "@nextui-org/react";
import { NotFound } from "../pages/NotFound";
export const Solution = () => {
    const {id, username} = useParams()
    const [selectedTestCase, setSelectedTestCase] = useState(null);
    const {user} = useContext(UserContext)
    const navigate = useNavigate()
    useEffect(() => {
        if(user && user.getUser && user.getUser.username !== username && user.getUser.admin === false){
            navigate(-1);
        }
    }, [user, username])
    const [solution, setSolution] = useState('')
    const solutionQuery = gql`
        query GetSolution($id: String){
            getSolution(id: $id){
                code
                compilationError
                date
                fileMemory
                id_solution
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
                  expectedOutput
                  cerr
                }
                username
            }
        }
    `
    const {error, loading} = useQuery(solutionQuery, {
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
    if(error || !user || !user.getUser) return <NotFound/>
    return (
        <div className="container mx-auto grid grid-cols-2 max-lg:grid-cols-1 my-10 p-3 gap-5">
            <div>
                <p className="text-5xl mb-5">Solution for problem: <Link className="text-default-500" to={`/problems/${solution.getSolution.problem}?code=${encodeURIComponent(solution.getSolution.code)}&language=${solution.getSolution.language}`}>{solution.getSolution.problem}</Link></p>
                <Table>
                    <TableHeader>
                        <TableColumn hidden></TableColumn>
                        <TableColumn hidden></TableColumn>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>Problem</TableCell>
                            <TableCell>
                                <Link className="font-bold" to={`/problems/${solution.getSolution.problem}?code=${encodeURIComponent(solution.getSolution.code)}&language=${solution.getSolution.language}`}>{solution.getSolution.problem}</Link>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Language</TableCell>
                            <TableCell>{solution.getSolution.language}</TableCell>
                        </TableRow>
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
                            <TableCell>{parseFloat(solution.getSolution.fileMemory).toFixed(2) + ' kbytes'}</TableCell>
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

                                        <TableCell>{test.executionTime + ' s'}</TableCell>
                                        <TableCell>{test.memoryUsed / 1024 + ' MB'}</TableCell>
                                        <TableCell>{test.score}</TableCell>
                                        <TableCell>{test.status}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => setSelectedTestCase(test)} variant="flat">See test case</Button>
                                        </TableCell>
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
                    {() => (
                        <>
                            <ModalHeader>Test case</ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col justify-between">
                                    <div className="mb-5">
                                        <p className="text-3xl mb-2">Input</p>
                                        <pre>
                                            <Snippet className="w-[100%]" symbol="">
                                                {selectedTestCase.input}
                                            </Snippet>
                                        </pre>
                                    </div>
                                    <div className="mb-5">
                                        <p className="text-3xl mb-2">Output</p>
                                        <pre>
                                            <Snippet symbol="" className="w-[100%]">
                                                {selectedTestCase.output}
                                            </Snippet>
                                        </pre>
                                    </div>
                                    <div className="mb-5">
                                        <p className="text-3xl mb-2">Expected output</p>
                                        <pre>
                                            <Snippet symbol="" className="w-[100%]">
                                                {selectedTestCase.expectedOutput}
                                            </Snippet>
                                        </pre>
                                    </div>
                                    {selectedTestCase.cerr && (
                                        <div className="mb-5">
                                            <p className="text-3xl mb-2">Cerr</p>
                                            <pre>
                                                <Snippet symbol="" className="w-[100%]">
                                                    {selectedTestCase.cerr}
                                                </Snippet>
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <div className="h-[100%]">
                <div className="text-4xl mb-3">Submited code</div>
                <Snippet className="w-full overflow-auto" symbol=""> <pre>{solution.getSolution.code}</pre> </Snippet>
            </div>
        </div>
    )
}
