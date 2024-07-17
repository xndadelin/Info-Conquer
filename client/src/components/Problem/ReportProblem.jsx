import { Modal, ModalBody, ModalContent, ModalFooter, Button, ModalHeader, Textarea, Input, Chip } from "@nextui-org/react";
import { Bug } from "../../assets/svgs/Bug";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { REPORT_PROBLEM } from "../../utils/Queries";


export const ReportProblem = ({ isOpen, onClose, problem, user }) => {
    const { t } = useTranslation();
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [createReport, { error, loading }] = useMutation(REPORT_PROBLEM, {
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
        <section>
            <Modal className="bg-gray-800" shadow="lg" placement="center" isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader className="flex align-center gap-3">
                        {t("reportProblemPage.reportProblemTitle")}
                        <Bug />
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            <div>
                                <h4>{t("reportProblemPage.reportedBy")}&nbsp;</h4>
                                <span className="font-bold">{user.getUser.username}</span>
                            </div>
                            <div>
                                <h4>{t("reportProblemPage.problem")}&nbsp;</h4>
                                <span className="font-bold">{problem.title}</span>
                            </div>
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
                            color="primary"
                            isDisabled={!title || !description}
                            onClick={() => {
                                createReport();
                            }}
                            isLoading={loading}
                        >
                            {t("reportProblemPage.submitButtonText")}
                        </Button>
                        <Button variant="flat" color="danger" onClick={onClose}>
                            {t("reportProblemPage.closeButtonText")}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </section>
    )
};
