import { useContext, useState } from 'react';
import { NotFound } from './NotFound';
import { Input, Button, Chip, Textarea } from '@nextui-org/react';
import { gql, useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next'; 
import { UserContext } from '../context/UserContext';

export const PublishArticle = () => {
    const { t } = useTranslation(); 

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState([]);
    const [tag, setTag] = useState('');
    const [error, setError] = useState('');

    const onAddTag = () => {
        setTags([...tags, tag]);
        setTag('');
    };

    const onDeleteTag = (tagToDelete) => {
        setTags(tags.filter((tag) => tag !== tagToDelete));
    };

    const publishGql = gql`
        mutation PublishArticle($title: String, $content: String, $tags: [String]) {
            publishArticle(title: $title, content: $content, tags: $tags) {
                success
            }
        }
    `;

    const [publishArticle, { loading }] = useMutation(publishGql, {
        variables: { title, content, tags },
        onError: (error) => {
            setError(error.message);
        },
        onCompleted: (data) => {
            if (data.publishArticle.success) {
                window.location.href = `/articles/${title}`;
            }
        }
    });

    const { user } = useContext(UserContext);

    if (!user || !user.getUser || !user.getUser.admin) {
        return <NotFound />;
    }

    return (
        <div className="container mx-auto p-5 h-screen">
            <div className="flex flex-col gap-5">
                <p className="text-5xl font-extrabold">{t('publishArticle.title')}</p>
                <Input variant="flat" onChange={(e) => setTitle(e.target.value)} value={title} label={t('publishArticle.title')} />
                <Input
                    label={t('publishArticle.tags')}
                    endContent={<Button disabled={tag === ''} variant="flat" color="danger" onClick={onAddTag}>{t('publishArticle.addTag')}</Button>}
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                    {tags &&
                        tags.map((tag, index) => (
                            <Chip className="cursor-pointer" key={index} onClick={() => onDeleteTag(tag)}>
                                {tag}
                            </Chip>
                        ))}
                </div>
                <p className="text-2xl font-bold">{t('publishArticle.content')}</p>
                <Textarea variant="flat" minRows={10} label={t('publishArticle.content')} value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <div className="flex mt-5 justify-between">
                {error && <Chip color="danger" variant="flat">{error}</Chip>}
                <Button className="ml-auto" loading={loading} onClick={publishArticle} variant="flat" color="danger">
                    {t('publishArticle.publishButton')}
                </Button>
            </div>
        </div>
    );
};