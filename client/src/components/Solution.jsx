import { useParams, Link, useNavigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, ModalBody, ModalContent, ModalHeader, Table, TableCell, TableRow, TableColumn, TableHeader, Snippet, Button, TableBody } from "@nextui-org/react";
import { NotFound } from "../pages/NotFound";
import { Loading } from "./Loading";
import { UserContext } from "../context/UserContext";

export const Solution = () => {
    const { id, username } = useParams();
    const { t } = useTranslation();
    const [selectedTestCase, setSelectedTestCase] = useState(null);
    const { user } = useContext(UserContext);
    const [solution, setSolution] = useState('');

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
    `;

    const { error, loading } = useQuery(solutionQuery, {
        variables: { id },
        onCompleted: (data) => {
            setSolution(data);
        }
    });

    useEffect(() => {
        if (user && user.getUser && user.getUser.username !== username && user.getUser.admin === false) {
            navigate(-1);
        }
    }, [user, username]);

    const navigate = useNavigate();

    if (loading || !solution) {
        return <Loading />;
    }

    if (error || !user || !user.getUser) {
        return <NotFound />;
    }

    return (
        <div className="container mx-auto grid grid-cols-2 max-lg:grid-cols-1 my-10 p-3 gap-5">
            <div>
                <p className="text-5xl mb-5">{t("solution.title")} <Link className="text-default-500" to={`/problems/${solution.getSolution.problem}?code=${encodeURIComponent(solution.getSolution.code)}&language=${solution.getSolution.language}`}>{solution.getSolution.problem}</Link> </p>
                <Table>
                    <TableHeader>
                        <TableColumn hidden></TableColumn>
                        <TableColumn hidden></TableColumn>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>{t("solution.labels.problem")}</TableCell>
                            <TableCell>
                                <Link className="font-bold" to={`/problems/${solution.getSolution.problem}?code=${encodeURIComponent(solution.getSolution.code)}&language=${solution.getSolution.language}`}>{solution.getSolution.problem}</Link>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>{t("solution.labels.language")}</TableCell>
                            <TableCell>{solution.getSolution.language}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>{t("solution.labels.status")}</TableCell>
                            <TableCell>{solution.getSolution.compilationError ? t("solution.status.rejected") : t("solution.status.accepted")}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>{t("solution.labels.username")}</TableCell>
                            <TableCell>{solution.getSolution.username}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>{t("solution.labels.date")}</TableCell>
                            <TableCell>{new Date(+solution.getSolution.date).toLocaleString()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>{t("solution.labels.fileMemory")}</TableCell>
                            <TableCell>{parseFloat(solution.getSolution.fileMemory).toFixed(2) + ' kbytes'}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                {!solution.getSolution.compilationError ? (
                    <div>
                        <p className="text-4xl mt-4 mb-4">{t("solution.summary.title")}</p>
                        <Table>
                            <TableHeader>
                                <TableColumn>{t("solution.summary.table.test")}</TableColumn>
                                <TableColumn>{t("solution.summary.table.executionTime")}</TableColumn>
                                <TableColumn>{t("solution.summary.table.memoryUsed")}</TableColumn>
                                <TableColumn>{t("solution.summary.table.score")}</TableColumn>
                                <TableColumn>{t("solution.summary.table.status")}</TableColumn>
                                <TableColumn>{t("solution.summary.table.testCase")}</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {solution.getSolution.tests.map((test, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{test.executionTime + ' s'}</TableCell>
                                        <TableCell>{test.memoryUsed / 1024 + ' MB'}</TableCell>
                                        <TableCell>{test.score}</TableCell>
                                        <TableCell>{test.status}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => setSelectedTestCase(test)} variant="flat">{t("solution.summary.table.viewTestCase")}</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <Snippet color="danger" symbol="" className="mt-5">
                        <pre style={{ whiteSpace: 'pre-wrap' }}>
                            {solution.getSolution.compilationError}
                        </pre>
                    </Snippet>
                )}
            </div>
            <Modal onClose={() => setSelectedTestCase(null)} isOpen={selectedTestCase !== null}>
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader>{t("solution.modal.testCase")}</ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col justify-between">
                                    <div className="mb-5">
                                        <p className="text-3xl mb-2">{t("solution.modal.input")}</p>
                                        <pre>
                                            <Snippet className="w-[100%]" symbol="">
                                                {selectedTestCase.input}
                                            </Snippet>
                                        </pre>
                                    </div>
                                    <div className="mb-5">
                                        <p className="text-3xl mb-2">{t("solution.modal.output")}</p>
                                        <pre>
                                            <Snippet symbol="" className="w-[100%]">
                                                {selectedTestCase.output}
                                            </Snippet>
                                        </pre>
                                    </div>
                                    <div className="mb-5">
                                        <p className="text-3xl mb-2">{t("solution.modal.expectedOutput")}</p>
                                        <pre>
                                            <Snippet symbol="" className="w-[100%]">
                                                {selectedTestCase.expectedOutput}
                                            </Snippet>
                                        </pre>
                                    </div>
                                    {selectedTestCase.cerr && (
                                        <div className="mb-5">
                                            <p className="text-3xl mb-2">{t("solution.modal.cerr")}</p>
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
                <div className="text-4xl mb-3">{t("solution.submittedCode")}</div>
                <Snippet className="w-full overflow-auto" symbol=""> <pre>{solution.getSolution.code}</pre> </Snippet>
            </div>
        </div>
    );
};