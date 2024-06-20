import { Modal, ModalBody, ModalContent, ModalFooter, Button, ModalHeader, Textarea, Input, Chip } from "@nextui-org/react"
import {Bug} from "../utils/Bug"
import { useState } from "react"
import {gql, useMutation} from "@apollo/client"
const REPORT_PROBLEM = gql`
    mutation createReport($title: String!, $reporter: String!, $description: String!, $type: String!, $problem: String!) {
        createReport(title: $title, reporter: $reporter, description: $description, type: $type, problem: $problem) {
            success
        }
    }
`
export const ReportProblem = ({isOpen, onClose, problem, user}) => {
    const [description, setDescription] = useState("")
    const [title, setTitle] = useState("")
    const [createReport, {loading, data, error}] = useMutation(REPORT_PROBLEM, {
        onCompleted: () => {
            onClose()
        },
        variables : {
            title, 
            reporter: user.getUser.username,
            description,
            type: 'problem',
            problem: problem.title

        }
    })
    return (
        <Modal shadow="lg" placement="center" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex align-center gap-3">
                    Report Problem
                    <Bug/>
                </ModalHeader>
                <ModalBody>
                    <div>
                        <p>Reported by: &nbsp; 
                            <span className="font-bold">{user.getUser.username}</span>
                        </p>
                        <p>Problem: &nbsp;
                            <span className="font-bold">{problem.title}</span>
                        </p>
                    </div>
                    <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} variant="faded" isInvalid={!title} errorMessage="Type a title" />
                    <Textarea isInvalid={!description} errorMessage="Write a description" placeholder="Describe the problem" variant="faded" value={description} minRows={20} onChange={(e) => setDescription(e.target.value)} />
                    {error && (
                        <Chip color="danger">
                            {error.message}
                        </Chip>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button variant="flat" color="success" isDisabled={!title || !description} onClick={() => {
                        onClose();
                        createReport()
                    }}>Submit</Button>
                    <Button variant="flat" color="danger" onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}