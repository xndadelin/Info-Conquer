import { useCallback, useContext, useState } from 'react';
import { NotFound } from '../../components/Miscellaneous/NotFound';
import { Input, Button, Chip } from '@nextui-org/react';
import { gql, useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next'; 
import { UserContext } from '../../context/UserContext';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import { PUBLISH_ARTICLE } from '../../utils/Queries';

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

    const onChangeCode = useCallback((val) => {
        setContent(val)
    })

    const onDeleteTag = (tagToDelete) => {
        setTags(tags.filter((tag) => tag !== tagToDelete));
    };

    const [publishArticle, { loading }] = useMutation(PUBLISH_ARTICLE, {
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
        <main className="container mx-auto p-5 h-[100%]">
            <section className="flex flex-col gap-5">
                <p className="text-5xl font-extrabold">{t('publishArticle.title')}</p>
                <Input variant="flat" onChange={(e) => setTitle(e.target.value)} value={title} label={t('publishArticle.title')} />
                <Input
                    label={t('publishArticle.tags')}
                    endContent={<Button disabled={tag === ''} variant="flat" color="primart" onClick={onAddTag}>{t('publishArticle.addTag')}</Button>}
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
                <div className='rounded-lg'>
                    <CodeMirror
                        value={content}
                        onChange={onChangeCode}
                        theme={oneDark}
                        extensions={[loadLanguage('html')]}
                        height='1000px'
                    />
                </div>
            </section>
            <section className="flex mt-5 justify-between">
                {error && <Chip color="danger" variant="flat">{error}</Chip>}
                <Button className="ml-auto" loading={loading} onClick={publishArticle} variant="flat" color="primary">
                    {t('publishArticle.publishButton')}
                </Button>
            </section>
            <section className='mt-5'>
                <h1  className='text-3xl font-bold mb-20'>Preview</h1>
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </section>
        </main>
    );
};