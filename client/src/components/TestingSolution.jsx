import { Modal, ModalBody, ModalContent, ModalHeader, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Snippet } from "@nextui-org/react"
export const TestingSolution = ({onClose, isOpen, loading, tests}) => {
    console.log(tests)
    const testsTable = () => {
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
                <p className="text-3xl p-3">Score: {tests.score}</p>
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
                    {tests.tests && testsTable()}
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}