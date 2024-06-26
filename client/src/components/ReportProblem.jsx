import { Modal, ModalBody, ModalContent, ModalFooter, Button, ModalHeader, Textarea, Input, Chip } from "@nextui-org/react";
import { Bug } from "../utils/Bug";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";

const REPORT_PROBLEM = gql`
    mutation createReport($title: String!, $reporter: String!, $description: String!, $type: String!, $problem: String!) {
        createReport(title: $title, reporter: $reporter, description: $description, type: $type, problem: $problem) {
            success
        }
    }
`;

export const ReportProblem = ({ isOpen, onClose, problem, user }) => {
    const { t } = useTranslation();
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [createReport, { error }] = useMutation(REPORT_PROBLEM, {
        onCompleted: () => {
            onClose();
        },
        variables: {
            title,
            reporter: user.getUser.username,
            description,
            type: 'problem',
            problem: problem.title
        }
    });
    return (
        <Modal shadow="lg" placement="center" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex align-center gap-3">
                    {t("reportProblemPage.reportProblemTitle")}
                    <Bug />
                </ModalHeader>
                <ModalBody>
                    <div>
                        <p>
                            {t("reportProblemPage.reportedBy")}&nbsp;
                            <span className="font-bold">{user.getUser.username}</span>
                        </p>
                        <p>
                            {t("reportProblemPage.problem")}&nbsp;
                            <span className="font-bold">{problem.title}</span>
                        </p>
                    </div>
                    <Input
                        placeholder={t("reportProblemPage.titleInputPlaceholder")}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        variant="faded"
                        isInvalid={!title}
                        errorMessage={t("reportProblemPage.titleInputErrorMessage")}
                    />
                    <Textarea
                        isInvalid={!description}
                        errorMessage={t("reportProblemPage.descriptionTextareaErrorMessage")}
                        placeholder={t("reportProblemPage.descriptionTextareaPlaceholder")}
                        variant="faded"
                        value={description}
                        minRows={20}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {error && (
                        <Chip color="danger">
                            {t("reportProblemPage.errorChipTitle")} {error.message}
                        </Chip>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="flat"
                        color="success"
                        isDisabled={!title || !description}
                        onClick={() => {
                            onClose();
                            createReport();
                        }}
                    >
                        {t("reportProblemPage.submitButtonText")}
                    </Button>
                    <Button variant="flat" color="danger" onClick={onClose}>
                        {t("reportProblemPage.closeButtonText")}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
};
