import { Modal, ModalBody, ModalContent, ModalHeader, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Snippet } from "@nextui-org/react"
import { useContext } from "react"
import {UserContext} from '../context/UserContext'
import { Loading } from "./Loading"
export const TestingSolution = ({onClose, isOpen, loading, tests}) => {
    const user = useContext(UserContext)
    if(!loading && !tests) return null
    if(!user) return <Loading/>
    const testsTable = (user) => {
        return (
            <div>
                <Table>
                    <TableHeader>
                        <TableColumn>Index</TableColumn>
                        <TableColumn>Time</TableColumn>
                        <TableColumn>Memory</TableColumn>
                        <TableColumn>Score</TableColumn>
                        <TableColumn>Status</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {tests.tests && tests.tests.map((test, index) => (
                                <TableRow>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{test.executionTime}</TableCell>
                                    <TableCell>{test.memoryUsed}</TableCell>
                                    <TableCell>{test.score}</TableCell>
                                    <TableCell>{test.status}</TableCell>
                                </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="mt-4 mb-4 flex justify-center">
                    {tests.score === "100" ? <Snippet className="w-[100%]" hideCopyButton symbol='' color="success">All tests passed! Congrats!</Snippet> : (
                        <Snippet className="w-[100%]" hideCopyButton symbol='' color="warning">Some tests failed. You can check the tests!</Snippet>
                    )}
                </div>
            </div>
        )
    }
    const compilationError = () => {
        return (
                <Snippet color="danger">
                    <pre style={{whiteSpace: 'pre-wrap'}}>
                        {tests.compilationError}
                    </pre>
                </Snippet>
        )
    }
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
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
    )
}