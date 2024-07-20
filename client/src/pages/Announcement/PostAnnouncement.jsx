import { useContext, useEffect, useState } from 'react';
import { NotFound } from '../../components/Miscellaneous/NotFound';
import { Input, Button, useDisclosure } from '@nextui-org/react';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../context/UserContext';
import { POST_ANNOUNCEMENT } from '../../utils/Queries';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.min.css';
import { TextEditor } from '../../components/Editors/TextEditor';
import { Progress } from '@nextui-org/react';

export const PostAnnouncement = () => {
    const { t } = useTranslation();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [step, setStep] = useState(0);
    const [prompt, setPrompt] = useState({
        userPrompt: '',
        content: ''
    });

    const { isOpen, onClose, onOpen } = useDisclosure();

    useEffect(() => {
        Prism.highlightAll();
    }, []);

    const [postAnnouncement, { loading }] = useMutation(POST_ANNOUNCEMENT, {
        variables: { title, content },
        onError: (error) => {
            setError(error.message);
        },
        onCompleted: (data) => {
            if (data.postAnnouncement.success) {
                window.location.href = `/announcement/${title}`;
            }
        }
    });

    const { user } = useContext(UserContext);

    if (!user || !user.getUser || !user.getUser.admin) {
        return <NotFound />;
    }

    const steps = [
        {
            title: t('postAnnouncement.title'),
            icon: '📝',
            content: (
                <Input
                    variant="bordered"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    label={t('postAnnouncement.enterTitle')}
                    className='mt-5'
                />
            ),
            disabled: title === ''
        },
        {
            title: t('postAnnouncement.content'),
            icon: '✍️',
            content: (
                <div className='mt-5 w-full'>
                    <TextEditor
                        content={content}
                        setContent={setContent}
                        prompt={prompt}
                        setPrompt={setPrompt}
                        setError={setError}
                        onOpen={onOpen}
                        isOpen={isOpen}
                        onClose={onClose}
                    />
                </div>
            ),
            disabled: content === ''
        },
        {
            title: t('postAnnouncement.preview'),
            icon: '👁️',
            content: (
                <div className="border border-gray-700 p-5 mt-5 overflow-auto rounded-lg bg-gray-900">
                    <h1 className="text-3xl font-bold mb-4">{title}</h1>
                    <article id="announcement" dangerouslySetInnerHTML={{ __html: content }}></article>
                </div>
            ),
            disabled: content === '',
            error
        }
    ];

    return (
        <main className="container mx-auto p-5 py-20 min-h-screen">
            <section className='bg-gray-800 rounded-xl p-8 flex flex-col shadow-lg'>
                <h1 className="text-4xl font-bold mb-8 text-center text-white">{t('postAnnouncement.title')}</h1>
                <Progress value={(step + 1) * 33.33} className="mb-8" color="primary" />
                <div className="flex-grow">
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                        <span className="mr-2">{steps[step].icon}</span>
                        {steps[step].title} 
                    </h2>
                    {steps[step].content}
                </div>
                <div className='flex justify-between mt-10'>
                    <Button color='primary' variant='bordered' onClick={() => setStep(step - 1)} isDisabled={step === 0}>
                        {t('postAnnouncement.previous')}
                    </Button>
                    {step === 2 ? (
                        <div>
                            <Button variant='solid' color='success' onClick={postAnnouncement} isDisabled={loading} isLoading={loading}>
                                {t('postAnnouncement.post')}
                            </Button>
                        </div>
                    ) : (
                        <Button variant='solid' color='primary' onClick={() => setStep(step + 1)} isDisabled={steps[step].disabled}>
                            {t('postAnnouncement.next')}
                        </Button>
                    )}
                </div>
            </section>
        </main>
    );
};