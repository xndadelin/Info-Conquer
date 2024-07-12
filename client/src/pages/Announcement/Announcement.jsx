import { useQuery } from '@apollo/client';
import { Link, useParams } from 'react-router-dom';
import { Loading } from '../../components/Miscellaneous/Loading';
import { NotFound } from '../../components/Miscellaneous/NotFound';
import { useTranslation } from 'react-i18next';
import { GET_ANNOUNCEMENT } from '../../utils/Queries';

export const Announcement = () => {
    const { title } = useParams();
    const { data, error, loading } = useQuery(GET_ANNOUNCEMENT, {
        variables: { title }
    });
    const { t } = useTranslation();

    if (loading) return <Loading />;
    if (error) return <NotFound />;

    return (
        <main className="container mx-auto py-10">
            <header>
                <h1 className="text-3xl font-bold">{data.getAnnouncement.title}</h1>
            </header>
            <section className="text-slate">
                <p>{t('announcement.announcedBy')}</p>
                <Link to={`/profile/${data.getAnnouncement.createdBy}`} className="text-default-500">
                    {data.getAnnouncement.createdBy}
                </Link>
            </section>
            <article className='mt-5' dangerouslySetInnerHTML={{ __html: data.getAnnouncement.content }}></article>
        </main>
    );
};