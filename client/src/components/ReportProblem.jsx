import { Modal, ModalBody, ModalContent, ModalFooter, Button, ModalHeader, Textarea } from "@nextui-org/react"
import {Bug} from "../utils/Bug"
import { useState } from "react"
export const ReportProblem = ({isOpen, onClose, problem, user}) => {
    const [description, setDescription] = useState("")
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
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
                    <Textarea placeholder="Describe the problem" value={description} minRows={20} onChange={(e) => setDescription(e.target.value)} />
                </ModalBody>
                <ModalFooter>
                    <Button variant="flat" color="success" onClick={onClose}>Submit</Button>
                    <Button variant="flat" color="danger" onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}