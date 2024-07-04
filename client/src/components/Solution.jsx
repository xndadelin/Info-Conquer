import { useParams, Link, useNavigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, ModalBody, ModalContent, ModalHeader, Table, TableCell, TableRow, TableColumn, TableHeader, Snippet, Button, TableBody, CardBody, Card, CardFooter, CardHeader, Divider } from "@nextui-org/react";
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

    if (loading) {
        return <Loading />;
    }

    if (error || !user || !user.getUser || !solution.getSolution) {
        return <NotFound />;
    }

   
    return (
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 my-10 p-3 gap-8 g-[#121212]  text-gray-200">
            <Card className="p-5">
                <CardHeader>
                    <h1 className="text-4xl font-bold mb-4">{t("solution.title")} 
                        <Link className="text-gray-400 hover transition-colors" to={`/problems/${solution.getSolution.problem}?code=${encodeURIComponent(solution.getSolution.code)}&language=${solution.getSolution.language}`}>
                            {solution.getSolution.problem}
                        </Link>
                    </h1>
                </CardHeader>
                <CardBody>
                    <Table 
                        aria-label="Solution details"
                        className="mb-6 shadow-md"
                        selectionMode="single"
                    >
                        <TableHeader>
                            <TableColumn hidden></TableColumn>
                            <TableColumn hidden></TableColumn>
                        </TableHeader>
                        <TableBody>
                            <TableRow key="1">
                                <TableCell>{t("solution.labels.problem")}</TableCell>
                                <TableCell>
                                    <Link className="font-bold hover" to={`/problems/${solution.getSolution.problem}?code=${encodeURIComponent(solution.getSolution.code)}&language=${solution.getSolution.language}`}>
                                        {solution.getSolution.problem}
                                    </Link>
                                </TableCell>
                            </TableRow>
                            <TableRow key="2">
                                <TableCell>{t("solution.labels.language")}</TableCell>
                                <TableCell>{solution.getSolution.language}</TableCell>
                            </TableRow>
                            <TableRow key="3">
                                <TableCell>{t("solution.labels.status")}</TableCell>
                                <TableCell>
                                    <span className={solution.getSolution.compilationError ? "text-red-500" : "text-green-500"}>
                                        {solution.getSolution.compilationError ? t("solution.status.rejected") : t("solution.status.accepted")}
                                    </span>
                                </TableCell>
                            </TableRow>
                            <TableRow key="4">
                                <TableCell>{t("solution.labels.username")}</TableCell>
                                <TableCell>{solution.getSolution.username}</TableCell>
                            </TableRow>
                            <TableRow key="5">
                                <TableCell>{t("solution.labels.date")}</TableCell>
                                <TableCell>{new Date(+solution.getSolution.date).toLocaleString()}</TableCell>
                            </TableRow>
                            <TableRow key="6">
                                <TableCell>{t("solution.labels.fileMemory")}</TableCell>
                                <TableCell>{parseFloat(solution.getSolution.fileMemory).toFixed(2) + ' kbytes'}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    
                    {!solution.getSolution.compilationError ? (
                        <div>
                            <h2 className="text-3xl font-semibold mt-8 mb-4">{t("solution.summary.title")}</h2>
                            <Table 
                                aria-label="Test case summary"
                                selectionMode="single"
                                className="shadow-md"
                            >
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
                                            <TableCell>
                                                {test.status}
                                            </TableCell>
                                            <TableCell>
                                                <Button onClick={() => setSelectedTestCase(test)} size="sm" color="danger" variant="flat">
                                                    {t("solution.summary.table.viewTestCase")}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <Snippet color="danger" variant="flat" className="mt-5 bg-red-900/30">
                            <pre className="whitespace-pre-wrap" >
                                {solution.getSolution.compilationError}
                            </pre>
                        </Snippet>
                    )}
                </CardBody>
            </Card>

            <Card className="shadow-lg p-5">
                <CardHeader>
                    <h2 className="text-3xl font-semibold mb-3">{t("solution.submittedCode")}</h2>
                </CardHeader>
                <Divider className="" />
                <CardBody>
                    <Snippet className="w-full overflow-auto text-gray-300" symbol="">
                        <pre>{solution.getSolution.code}</pre>
                    </Snippet>
                </CardBody>
            </Card>

            <Modal 
                onClose={() => setSelectedTestCase(null)} 
                isOpen={selectedTestCase !== null}
            >
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{t("solution.modal.testCase")}</ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col justify-between gap-6">
                                    <div>
                                        <h3 className="text-2xl font-semibold mb-2">{t("solution.modal.input")}</h3>
                                        <Snippet className="w-full text-gray-300" symbol="">
                                            {selectedTestCase.input}
                                        </Snippet>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-semibold mb-2">{t("solution.modal.output")}</h3>
                                        <Snippet className="w-full text-gray-300" symbol="">
                                            {selectedTestCase.output}
                                        </Snippet>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-semibold mb-2">{t("solution.modal.expectedOutput")}</h3>
                                        <Snippet className="w-full text-gray-300" symbol="">
                                            {selectedTestCase.expectedOutput}
                                        </Snippet>
                                    </div>
                                    {selectedTestCase.cerr && (
                                        <div>
                                            <h3 className="text-2xl font-semibold mb-2">{t("solution.modal.cerr")}</h3>
                                            <Snippet className="w-full text-gray-300" symbol="">
                                                {selectedTestCase.cerr}
                                            </Snippet>
                                        </div>
                                    )}
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};