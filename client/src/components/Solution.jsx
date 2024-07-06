import { useParams, Link, useNavigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, ModalBody, ModalContent, ModalHeader, Table, TableCell, TableRow, TableColumn, TableHeader, Button, TableBody, CardBody, Card, CardFooter, CardHeader, Divider } from "@nextui-org/react";
import { NotFound } from "../pages/NotFound";
import { Loading } from "./Loading";
import { UserContext } from "../context/UserContext";

export const Solution = () => {
    const { id, username } = useParams();
    const { t } = useTranslation();
    const [selectedTestCase, setSelectedTestCase] = useState(null);
    const { user } = useContext(UserContext);
    const [solution, setSolution] = useState(null);

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
            setSolution(data.getSolution);
        }
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.getUser && user.getUser.username !== username && user.getUser.admin === false) {
            navigate(-1);
        }
    }, [user, username, navigate]);

    if (loading) {
        return <Loading />;
    }

    if (error || !user || !user.getUser || !solution) {
        return <NotFound />;
    }

    return (
        <div className="container mx-auto px-4 py-8 text-gray-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                    <CardHeader className="bg-gray-700 p-6">
                        <h1 className="text-2xl font-bold text-white">
                            {t("solution.title")} 
                            <Link className="text-blue-300 hover:text-blue-200 transition-colors ml-2" to={`/problems/${solution.problem}?code=${encodeURIComponent(solution.code)}&language=${solution.language}`}>
                                {solution.problem}
                            </Link>
                        </h1>
                    </CardHeader>
                    <CardBody className="p-6">
                        <Table 
                            aria-label="Solution details"
                            className="mb-8"
                        >
                            <TableHeader>
                                <TableColumn>Property</TableColumn>
                                <TableColumn>Value</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {[
                                    { label: t("solution.labels.problem"), value: <Link className="text-blue-300 hover:text-blue-200" to={`/problems/${solution.problem}?code=${encodeURIComponent(solution.code)}&language=${solution.language}`}>{solution.problem}</Link> },
                                    { label: t("solution.labels.language"), value: solution.language },
                                    { label: t("solution.labels.status"), value: <span className={solution.compilationError ? "text-red-400" : "text-green-400"}>{solution.compilationError ? t("solution.status.rejected") : t("solution.status.accepted")}</span> },
                                    { label: t("solution.labels.username"), value: solution.username },
                                    { label: t("solution.labels.date"), value: new Date(+solution.date).toLocaleString() },
                                    { label: t("solution.labels.fileMemory"), value: parseFloat(solution.fileMemory).toFixed(2) + ' kbytes' },
                                ].map((row, index) => (
                                    <TableRow key={index} className="hover:bg-gray-700 transition-colors">
                                        <TableCell>{row.label}</TableCell>
                                        <TableCell>{row.value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        
                        {!solution.compilationError ? (
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-gray-200">{t("solution.summary.title")}</h2>
                                <Table 
                                    aria-label="Test case summary"
                                    className="w-full"
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
                                        {solution.tests.map((test, index) => (
                                            <TableRow key={index} className="hover:bg-gray-700 transition-colors duration-200">
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{test.executionTime + ' s'}</TableCell>
                                                <TableCell>{(test.memoryUsed / 1024).toFixed(2) + ' MB'}</TableCell>
                                                <TableCell>{test.score}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded ${test.status === 'Accepted' ? 'bg-green-700' : 'bg-red-700'}`}>
                                                        {test.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Button onClick={() => setSelectedTestCase(test)} size="sm" color="primary" variant="flat">
                                                        {t("solution.summary.table.viewTestCase")}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="mt-5 bg-red-900/30 p-4 rounded-lg">
                                <pre className="whitespace-pre-wrap text-red-300">
                                    {solution.compilationError}
                                </pre>
                            </div>
                        )}
                    </CardBody>
                </Card>

                <Card className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                    <CardHeader className="bg-gray-700 p-6">
                        <h2 className="text-xl font-semibold text-white">{t("solution.submittedCode")}</h2>
                    </CardHeader>
                    <Divider />
                    <CardBody className="p-6">
                        <pre className="w-full overflow-auto text-gray-300 bg-gray-900 p-4 rounded-lg">
                            {solution.code}
                        </pre>
                    </CardBody>
                </Card>
            </div>

            <Modal 
                onClose={() => setSelectedTestCase(null)} 
                isOpen={selectedTestCase !== null}
            >
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="border-b border-gray-700 pb-4">
                                <h3 className="text-xl font-semibold text-gray-200">{t("solution.modal.testCase")}</h3>
                            </ModalHeader>
                            <ModalBody className="py-6 bg-gray-800 text-gray-300">
                                <div className="space-y-6">
                                    {['input', 'output', 'expectedOutput', 'cerr'].map((field) => (
                                        selectedTestCase[field] && (
                                            <div key={field}>
                                                <h4 className="text-lg font-semibold mb-2 text-gray-200">{t(`solution.modal.${field}`)}</h4>
                                                <pre className="bg-gray-900 p-3 rounded-lg overflow-auto text-gray-300">
                                                    {selectedTestCase[field]}
                                                </pre>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};