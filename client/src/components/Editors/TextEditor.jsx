import { useMutation } from '@apollo/client';
import { GET_EDITOR_AI_RESPONSE } from '../../utils/Queries';
import { Editor } from '@tinymce/tinymce-react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Textarea, Button, Checkbox, Tooltip } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

export const TextEditor = ({
    prompt,
    setPrompt,
    setContent,
    onClose,
    setError,
    content,
    isOpen,
    onOpen
}) => {
    const [getResponseEditorAi, { loading: aiLoading }] = useMutation(GET_EDITOR_AI_RESPONSE, {
        variables: {
            ...prompt
        },
        onError: (error) => {
            setError(error.message);
        },
        onCompleted: (data) => {
            setContent(data.getResponseEditorAi.response);
            onClose();
            setPrompt({
                userPrompt: '',
                content: ''
            })

        },
    })

    const { t } = useTranslation();
    
    return (
        <>
            <Editor
                apiKey={process.env.REACT_APP_TINY_MCE_API_KEY}
                init={{
                    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker',
                    toolbar: 'ai | undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                    skin: 'oxide-dark',
                    content_css: 'dark',
                    height: 700,
                    setup: (editor) => {
                        editor.ui.registry.addButton('ai', {
                            text: 'AI',
                            onAction: () => {
                                onOpen();
                            }
                        })
                    }
                }}
                value={content}
                onEditorChange={(content) => {
                    setContent(content);
                    setPrompt({
                        userPrompt: prompt.userPrompt,
                        content
                    });
                }}
            />
            <section>
                <Modal
                    size="lg"
                    isOpen={isOpen}
                    onClose={onClose}
                    backdrop="blur"
                    className='bg-gray-900'
                >
                    <ModalContent>
                        <ModalHeader className="flex flex-col gap-1">
                            <h2 className="text-2xl font-bold">{t('textEditor.ai_assistant')}</h2>
                            <p className="text-sm text-gray-400">{t('textEditor.enter_prompt')}</p>
                        </ModalHeader>
                        <ModalBody>
                            <Textarea
                                variant="bordered"
                                label={t('textEditor.textarea_label')}
                                placeholder={t('textEditor.textarea_placeholder')}
                                minRows={3}
                                maxRows={6}
                                value={prompt.userPrompt}
                                onChange={(e) => setPrompt({
                                    userPrompt: e.target.value,
                                    prompt: prompt.content
                                })}
                            />
                            <div className="flex items-center gap-2 mt-4">
                                <Checkbox onChange={(e) => {
                                    if (e.target.checked) {
                                        setPrompt({
                                            userPrompt: prompt.userPrompt,
                                            content
                                        });
                                    }
                                }}>
                                    <span className="text-sm">{t('textEditor.context')}</span>
                                </Checkbox>
                                <Tooltip className='bg-gray-800' content="This will use the existing editor content to provide context for the AI">
                                    <span className="text-gray-400 cursor-help">ⓘ</span>
                                </Tooltip>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onClick={onClose} >
                                {t('textEditor.cancel')}
                            </Button>
                            <Button color="primary" onClick={getResponseEditorAi} isLoading={aiLoading}>
                                {t('textEditor.generate')}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </section>
        </>
    )

}