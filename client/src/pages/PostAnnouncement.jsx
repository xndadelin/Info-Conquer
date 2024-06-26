import { useContext, useState } from 'react';
import { Button, Chip, Input, Textarea } from '@nextui-org/react';
import { gql, useMutation } from '@apollo/client';
import { UserContext } from '../context/UserContext';
import { NotFound } from './NotFound';
import { useTranslation } from 'react-i18next';
const postAnnouncementQ = gql`
    mutation postAnnouncement($title: String, $content: String) {
        postAnnouncement(title: $title, content: $content) {
            success
        }
    }
`
export const PostAnnouncement = () => {
    const { t } = useTranslation();

    const { user } = useContext(UserContext);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [isError, setIsError] = useState(false);
    const [postAnnouncement, { error }] = useMutation(postAnnouncementQ, {
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
        <div className="container mx-auto py-10 h-screen">
            <p className="text-3xl font-bold mb-5">{t('postAnnouncement.title')}</p>
            {isError && (
                <Chip className="mb-5" color="danger" variant="flat">{t('postAnnouncement.errorChip')}</Chip>
            )}
            <Input className="mb-5" label={t('postAnnouncement.titleLabel')} value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea minRows={10} className="mb-5" label={t('postAnnouncement.contentLabel')} value={content} onChange={(e) => setContent(e.target.value)} />
            <div className="flex justify-end">
                <Button color="danger" variant="flat" className="mt-5" onClick={() => { postAnnouncement({ variables: { title, content } }) }}>{t('postAnnouncement.postButton')}</Button>
            </div>
        </div>
    );
};
