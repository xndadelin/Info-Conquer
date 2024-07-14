import { useContext, useEffect, useState} from 'react';
import { NotFound } from '../../components/Miscellaneous/NotFound';
import { Input, Button, Chip, useDisclosure } from '@nextui-org/react';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../context/UserContext';
import { PUBLISH_ARTICLE, GET_ARTICLE } from '../../utils/Queries';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.min.css';
import { TextEditor } from '../../components/Editors/TextEditor';
import { Progress } from '@nextui-org/react';
import { useParams } from 'react-router-dom';

export const PublishArticle = ({type}) => {
    const { t } = useTranslation();
    const { id } = useParams();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState([]);
    const [tag, setTag] = useState('');
    const [error, setError] = useState('');
    const [step, setStep] = useState(0);
    const [excerpt, setExcerpt] = useState('');
    const { user } = useContext(UserContext);
    const [prompt, setPrompt] = useState({
        userPrompt: '',
        content: ''
    });

    const { isOpen, onClose, onOpen } = useDisclosure();

    const onAddTag = () => {
        setTags([...tags, tag]);
        setTag('');
    };

    useEffect(() => {
        Prism.highlightAll();;
    }, []);

    const onDeleteTag = (tagToDelete) => {
        setTags(tags.filter((tag) => tag !== tagToDelete));
    };
    useQuery(GET_ARTICLE, {
        variables: {
            id
        }, onCompleted: (data) => {
            setTitle(data.getArticle.title)
            setContent(data.getArticle.content)
            setTags(data.getArticle.tags)
            setExcerpt(data.getArticle.excerpt)
        },
        onError: (error) => {
            //do nothing for now
        }
    })

    const [publishArticle, { loading }] = useMutation(PUBLISH_ARTICLE, {
        variables: { 
            title,
            content,
            tags,
            excerpt,
            type
        },
        onError: (error) => {
            setError(error.message);
        },
        onCompleted: (data) => {
            if (data.publishArticle.success) {
                window.location.href = `/articles`;
            }
        }
    });

    if (!user || !user.getUser || !user.getUser.admin) {
        return <NotFound />;
    }

    const steps = [
        {
            title: t('publishArticle.enterTitle'),
            icon: '📝',
            content: (
                <Input
                    variant="bordered"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    label={t('publishArticle.enterTitle')}
                    className='mt-5'
                />
            ),
            disabled: title === ''
        },
        {
            title: t('publishArticle.excerpt'),
            icon: '📄',
            content: (
                <Input
                    variant="bordered"
                    onChange={(e) => setExcerpt(e.target.value)}
                    value={excerpt || ''}
                    label={t('publishArticle.excerpt')}
                    className='mt-5'
                />
            )
        },
        {
            title: t('publishArticle.tags'),
            icon: '🏷️',
            content: (
                <div className="space-y-4">
                    <Input
                        label={t('publishArticle.tags')}
                        endContent={
                            <Button disabled={tag === ''} size="sm" color="primary" onClick={onAddTag}>
                                {t('publishArticle.addTag')}
                            </Button>
                        }
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        className='mt-5'
                        variant='bordered'
                    />
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                            <Chip key={index} onClose={() => onDeleteTag(tag)} variant="flat" color="primary">
                                {tag}
                            </Chip>
                        ))}
                    </div>
                </div>
            )
        },
        {
            title: t('publishArticle.content'),
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
            title: t('publishArticle.preview'),
            icon: '👁️',
            content: (
                <div className="border border-gray-700 p-5 mt-5 overflow-auto rounded-lg bg-gray-900">
                    <h1 className="text-3xl font-bold mb-4">{title}</h1>
                    <div className="flex gap-2 mb-4">
                        {tags.map((tag, index) => (
                            <Chip key={index} size="sm" variant="flat" color="primary">{tag}</Chip>
                        ))}
                    </div>
                    <article id="announcement" dangerouslySetInnerHTML={{ __html: content }}></article>
                </div>
            ),
            disabled: content === '',
        }
    ];

    return (
        <main className="container mx-auto p-5 py-20 min-h-screen">
            <section className='bg-gray-800 rounded-xl p-8 flex flex-col shadow-lg'>
                <h1 className="text-4xl font-bold mb-8 text-center text-white">{t('publishArticle.title')}</h1>
                <Progress value={(step + 1) * 20} className="mb-8" color="primary" />
                <div className="flex-grow">
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                        <span className="mr-2">{steps[step].icon}</span>
                        {steps[step].title} 
                    </h2>
                    {steps[step].content}
                </div>
                <div className='flex justify-between mt-10'>
                    <Button color='primary' variant='bordered' onClick={() => setStep(step - 1)} isDisabled={step === 0}>
                        {t('publishArticle.previous')}
                    </Button>
                    {step === 4 ? (
                        <div>
                            {error && <Chip color="danger" className="mt-4 p-5 mr-5">{error}</Chip>}
                            <Button variant='solid' color='success' onClick={publishArticle} isDisabled={loading} isLoading={loading}>
                                {t('publishArticle.publish')}
                            </Button>
                        </div>
                    ) : (
                        <Button variant='solid' color='primary' onClick={() => setStep(step + 1)} isDisabled={steps[step].disabled}>
                            {t('publishArticle.next')}
                        </Button>
                    )}
                </div>
            </section>
        </main>
    );
};