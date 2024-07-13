import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { NotFound } from '../../components/Miscellaneous/NotFound';
import { Loading } from '../../components/Miscellaneous/Loading';
import { Button, Spinner } from '@nextui-org/react';
import { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { useMutation } from '@apollo/client';
import { Input, Chip } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { GET_ARTICLE, EDIT_ARTICLE } from '../../utils/Queries';
import { Editor } from '@tinymce/tinymce-react';

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

    const { loading } = useQuery(GET_ARTICLE, {
        variables: { id },
        onCompleted: (data) => {
            setContent(data.getArticle.content);
            setTitle(data.getArticle.title);
            setTags(data.getArticle.tags.length !== 0 ? data.getArticle.tags : []);
        }
    });

    const { user } = useContext(UserContext);
    const [edit, { loading: loadingSave, error }] = useMutation(EDIT_ARTICLE, {
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
    if (!title) return <NotFound />;

    return (
        <main className='container mx-auto py-5 min-h-screen'>
            <h1 className='text-2xl font-bold'>{t('article.edit')} {t('article.edit')}</h1>
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
            <section className="flex flex-wrap gap-2 mb-5">
                {tags && tags.map((tag, index) => (
                    <Chip className='cursor-pointer' key={index} onClick={() => onDeleteTag(tag)}>{tag}</Chip>
                ))}
            </section>
            
            <Editor
                apiKey={process.env.REACT_APP_TINY_MCE_API_KEY}
                init={{
                    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker',
                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                    skin: 'oxide-dark',
                    content_css: 'dark',
                    height: 700,
                }}
                  onEditorChange={(content) => setContent(content)}
            />

            <section className='flex justify-end gap-5 mt-5'>
                <Button
                    onClick={handleSave}
                    endContent={loadingSave ? <Spinner size='sm' color='secondary' /> : ''}
                    variant='flat'
                    color='primary'
                >
                    {t('article.edit')}
                </Button>
            </section>

            <section className='mt-5'>
                <h2 className='text-3xl font-bold mb-20'>Preview</h2>
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </section>
        </main>
    );
};
