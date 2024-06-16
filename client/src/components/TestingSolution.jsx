import { Modal, ModalBody, ModalContent, ModalHeader, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Snippet } from "@nextui-org/react"
import { useContext } from "react"
import {UserContext} from '../context/UserContext'
import { Loading } from "./Loading"
export const TestingSolution = ({onClose, isOpen, loading, tests}) => {
    const user = useContext(UserContext)
    if(!loading && !tests) return null
    if(!user) return <Loading/>
    const testsTable = () => {
        return (
            <div>
                <Table isCompact selectionMode>
                    <TableHeader>
                        <TableColumn>Index</TableColumn>
                        <TableColumn>Time</TableColumn>
                        <TableColumn>Memory</TableColumn>
                        <TableColumn>Score</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn>Exitcode/Exitsig</TableColumn>
                        <TableColumn>Message</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {tests.tests && tests.tests.map((test, index) => (
                                <TableRow>
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
                    {tests.score === "100" ? <Snippet className="w-[100%]" hideCopyButton symbol='' color="success">All tests passed! Congrats!</Snippet> : (
                        <Snippet className="w-[100%]" hideCopyButton symbol='' color="warning">
                            <pre className="whitespace-pre-wrap">
                                There are failed tests. Please check the message for more information.
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
                    <ModalHeader>Tests</ModalHeader>
                    <ModalBody>
                        {loading &&  <div className="min-h-[200px] flex justify-center self-center"><Spinner color="default"/></div>}
                        {tests.compilationError && compilationError()}
                        {tests.tests && testsTable(user)}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}