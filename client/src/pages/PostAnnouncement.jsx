import { useContext, useState } from 'react';
import { Button, Chip, Input, Textarea } from '@nextui-org/react';
import { gql, useMutation } from '@apollo/client';
import { UserContext } from '../context/UserContext';
import { NotFound } from '../components/NotFound';
import { useTranslation } from 'react-i18next';
import { POST_ANNOUNCEMENT } from '../utils/Queries';

export const PostAnnouncement = () => {
    const { t } = useTranslation();

    const { user } = useContext(UserContext);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [isError, setIsError] = useState(false);
    const [postAnnouncement, { error }] = useMutation(POST_ANNOUNCEMENT, {
        onCompleted: (data) => {
            if (data.postAnnouncement.success) {
                window.location.href = `/announcement/${title}`;
                setContent('');
                setTitle('');
            }
        },
        onError: () => {
            setIsError(true);
        }
    });

    if (!user || !user.getUser || !user.getUser.admin) {
        return <NotFound />;
    }

    return (
        <main className="container mx-auto py-10 h-screen">
            <p className="text-3xl font-bold mb-5">{t('postAnnouncement.title')}</p>
            {isError && error && (
                <Chip className="mb-5" color="danger" variant="flat">
                    {error.message}
                </Chip>
            )}
            <Input className="mb-5" label={t('postAnnouncement.titleLabel')} value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea minRows={10} className="mb-5" label={t('postAnnouncement.contentLabel')} value={content} onChange={(e) => setContent(e.target.value)} />
            <div className="flex justify-end">
                <Button color="primary" variant="flat" className="mt-5" onClick={() => { postAnnouncement({ variables: { title, content } }) }}>{t('postAnnouncement.postButton')}</Button>
            </div>
        </main>
    );
};
