import { Modal, ModalBody, ModalContent, ModalHeader, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Snippet } from "@nextui-org/react"
import { useContext } from "react"
import { UserContext } from '../context/UserContext'
import { useTranslation } from "react-i18next";

export const TestingSolution = ({ onClose, isOpen, loading, tests }) => {
    const { t } = useTranslation();
    const user = useContext(UserContext);

    if (!loading && !tests) return null;

    const testsTable = () => {
        return (
            <div>
                <Table isCompact selectionMode>
                    <TableHeader>
                        <TableColumn>{t('testingSolution.tests.index')}</TableColumn>
                        <TableColumn>{t('testingSolution.tests.time')}</TableColumn>
                        <TableColumn>{t('testingSolution.tests.memory')}</TableColumn>
                        <TableColumn>{t('testingSolution.tests.score')}</TableColumn>
                        <TableColumn>{t('testingSolution.tests.status')}</TableColumn>
                        <TableColumn>{t('testingSolution.tests.exitcode')}/{t('testingSolution.tests.exitsig')}</TableColumn>
                        <TableColumn>{t('testingSolution.tests.message')}</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {tests.tests && tests.tests.map((test, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{test.executionTime} s</TableCell>
                                <TableCell>{test.memoryUsed / 1024} MB</TableCell>
                                <TableCell>{test.score}</TableCell>
                                <TableCell color="warning">{test.status}</TableCell>
                                <TableCell>{test.exitcode != null ? test.exitcode : test.exitsig ? test.exitsig : '-'}</TableCell>
                                <TableCell>{test.message}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="mt-4 mb-4 flex justify-center">
                    {tests.score === "100" ? (
                        <Snippet className="w-[100%]" hideCopyButton symbol='' color="success">
                            {t('testingSolution.tests.allTestsPassed')}
                        </Snippet>
                    ) : (
                        <Snippet className="w-[100%]" hideCopyButton symbol='' color="warning">
                            <pre className="whitespace-pre-wrap">
                                {t('testingSolution.tests.failedTestsMessage')}
                            </pre>
                        </Snippet>
                    )}
                </div>
            </div>
        )
    }

    const compilationError = () => {
        return (
            <Snippet hideSymbol color="danger">
                <pre className="whitespace-pre-wrap">
                    {tests.compilationError}
                </pre>
            </Snippet>
        )
    }

    return (
        <div className="p-5">
            <Modal
                size="3xl"
                isOpen={isOpen}
                onClose={onClose}
                hideCloseButton={loading}
                isDismissable={!loading}
                isKeyboardDismissDisabled={loading}
                placement="center"
            >
                <ModalContent>
                    <ModalHeader>{t('testingSolution.modalHeader')}</ModalHeader>
                    <ModalBody>
                        {loading && <div className="min-h-[200px] flex justify-center self-center"><Spinner color="default" /></div>}
                        {tests.compilationError && (
                            <div>
                                <ModalHeader>{t('testingSolution.compilationError.title')}</ModalHeader>
                                {compilationError()}
                            </div>
                        )}
                        {tests.tests && testsTable(user)}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}
