import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { NotFound } from '../pages/NotFound';
import { Loading } from './Loading';
import { Button, Spinner, Textarea } from '@nextui-org/react';
import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useMutation } from '@apollo/client';
import { Input, Chip } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

const getArticle = gql`
    query GetArticle($id: String) {
        getArticle(id: $id) {
            content
            createdAt
            creator
            hasDisliked
            dislikes
            hasLiked
            likes
            title
            tags
            updatedAt
        }
    }
`;

const editArticle = gql`
    mutation EditArticle($id: String, $content: String, $tags: [String], $title: String) {
        editArticle(id: $id, content: $content, tags: $tags, title: $title) {
            success
        }
    }
`;

export const EditArticle = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState([]);
    const [tag, setTag] = useState('');
    const { t } = useTranslation();

    const onAddTag = () => {
        setTags([...tags, tag]);
        setTag('');
    };

    const onDeleteTag = (tag) => {
        setTags(tags.filter((i) => i !== tag));
    };

    const { loading } = useQuery(getArticle, {
        variables: { id },
        onCompleted: (data) => {
            setContent(data.getArticle.content);
            setTitle(data.getArticle.title);
            setTags(data.getArticle.tags.length !== 0 ? data.getArticle.tags : []);
        }
    });

    const { user } = useContext(UserContext);
    const [edit, { loading: loadingSave, error }] = useMutation(editArticle, {
        variables: { id, content, title, tags },
        onCompleted: (data) => {
            if (data.editArticle.success) {
                window.location.href = `/articles/${id}`;
            }
        }
    });

    if (!user.getUser.admin) return <NotFound />;
    const handleSave = () => {
        edit();
    };

    if (loading) return <Loading />;
    if (error) return <NotFound />;
    if (!content || !title) return <NotFound />;

    return (
        <div className='container mx-auto py-5 h-screen'>
            <p className='text-2xl font-bold'>{t('article.edit')} {t('article.edit')}</p>
            <Input
                variant='flat'
                className='mt-5'
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                label={t('article.edit')}
            />
            <Input
                label={t('article.edit')}
                endContent={<Button disabled={tag === ''} variant='flat' color='primary' onClick={onAddTag}>{t('article.edit')}</Button>}
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className='my-5'
            />
            <div className="flex flex-wrap gap-2 mb-5">
                {tags && tags.map((tag, index) => (
                    <Chip className='cursor-pointer' key={index} onClick={() => onDeleteTag(tag)}>{tag}</Chip>
                ))}
            </div>
            <Textarea
                minRows={10}
                maxRows={100}
                label={t('article.edit')}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className='mb-5'
            />
            <div className='flex justify-end gap-5 mt-5'>
                <Button
                    onClick={handleSave}
                    endContent={loadingSave ? <Spinner size='sm' color='secondary' /> : ''}
                    variant='flat'
                    color='primary'
                >
                    {t('article.edit')}
                </Button>
            </div>
        </div>
    );
};
