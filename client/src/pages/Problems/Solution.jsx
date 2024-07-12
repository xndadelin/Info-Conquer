import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, ModalBody, ModalContent, ModalHeader, Button, CardBody, Card, CardHeader, Divider, Chip } from "@nextui-org/react";
import { NotFound } from "../../components/Miscellaneous/NotFound";
import { Loading } from "../../components/Miscellaneous/Loading";
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { loadLanguage } from '@uiw/codemirror-extensions-langs'
import { getStatusColor } from "../../utils/getStatusColor";
import { GET_SOLUTION } from "../../utils/Queries";

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

export const Solution = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const [selectedTestCase, setSelectedTestCase] = useState(null);
    const [solution, setSolution] = useState(null);


    const { error, loading, data } = useQuery(GET_SOLUTION, {
        variables: { id },
        onCompleted: (data) => {
            setSolution(data.getSolution);
        }
    });

    if (loading || !solution) {
        return <Loading />;
    }

    if (!data.getSolution || error || !data) {
        return <NotFound />;
    }

    return (
        <main className="container mx-auto px-4 py-8 text-gray-300">
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                            {[
                                { label: t("solution.labels.problem"), value: <Link className="text-blue-300 hover:text-blue-200" to={`/problems/${solution.problem}?code=${encodeURIComponent(solution.code)}&language=${encodeURIComponent(solution.language)}`}>{solution.problem}</Link> },
                                { label: t("solution.labels.language"), value: solution.language },
                                { label: t("solution.labels.status"), value: <span className={solution.compilationError ? "text-red-400" : "text-green-400"}>{solution.compilationError ? t("solution.status.rejected") : t("solution.status.accepted")}</span> },
                                { label: t("solution.labels.username"), value: solution.username },
                                { label: t("solution.labels.date"), value: new Date(+solution.date).toLocaleString() },
                                { label: t("solution.labels.fileMemory"), value: parseFloat(solution.fileMemory).toFixed(2) + ' kbytes' },
                            ].map((row) => (
                                <div className="bg-gray-900 hover:bg-gray-700 rounded-lg p-4 shadow-lg transform transition duration-500 ease-in-out hover:scale-105">
                                    <h3 className="text-lg font-semibold mb-2">{row.label}</h3>
                                    <p>{row.value}</p>
                                </div>
                            ))}
                        </div>
                        {!solution.compilationError ? (
                            <div>
                                <h2 className="text-xl font-semibold mb-4 text-gray-200">{t("solution.summary.title")}</h2>
                                <div>
                                    <table className="w-full text-sm text-left text-gray-300 shadow-2xl">
                                        <thead className="text-xs uppercase bg-gray-700 text-gray-100">
                                            <tr>
                                                <th className="px-6 py-4">{t("solution.summary.table.test")}</th>
                                                <th className="px-6 py-4">{t("solution.summary.table.executionTime")}</th>
                                                <th className="px-6 py-4">{t("solution.summary.table.memoryUsed")}</th>
                                                <th className="px-6 py-4">{t("solution.summary.table.score")}</th>
                                                <th className="px-6 py-4">{t("solution.summary.table.status")}</th>
                                                <th className="px-6 py-4">{t("solution.summary.table.testCase")}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700">
                                            {solution.tests.map((test, index) => (
                                                <tr key={index} className={`hover:bg-gray-700 transition-colors duration-200 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}`}>
                                                    <td className="px-6 py-4">{index + 1}</td>
                                                    <td className="px-6 py-4">{test.executionTime + ' s'}</td>
                                                    <td className="px-6 py-4">{(test.memoryUsed / 1024).toFixed(2) + ' MB'}</td>
                                                    <td className="px-6 py-4">{test.score}</td>
                                                    <td className="px-6 py-4">
                                                       <Chip variant="flat" color={getStatusColor(test.status)}>
                                                              {test.status}
                                                       </Chip>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Button onClick={() => setSelectedTestCase(test)} size="sm" color="primary" variant="flat">
                                                            {t("solution.summary.table.viewTestCase")}
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
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
                    <CardBody className="p-0">
                        <CodeMirror
                            value={solution.code}
                            theme={oneDark}
                            height="100%"
                            extensions={[loadLanguage(languages_for_editor[solution.language])]}
                            readOnly
                        />
                    </CardBody>
                </Card>
            </section>

            <Modal 
                onClose={() => setSelectedTestCase(null)} 
                isOpen={selectedTestCase !== null}
            >
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="border-b border-gray-700 pb-4 bg-gray-800">
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
        </main>
    );
};
