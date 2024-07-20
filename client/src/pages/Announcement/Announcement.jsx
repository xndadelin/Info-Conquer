import { useQuery } from '@apollo/client';
import { Link, useParams } from 'react-router-dom';
import { Loading } from '../../components/Miscellaneous/Loading';
import { NotFound } from '../../components/Miscellaneous/NotFound';
import { useTranslation } from 'react-i18next';
import { GET_ANNOUNCEMENT } from '../../utils/Queries';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.min.css';
import { useEffect } from 'react';
export const Announcement = () => {
    const { title } = useParams();
    const { data, error, loading } = useQuery(GET_ANNOUNCEMENT, {
        variables: { title }
    });
    const { t } = useTranslation();
    
    useEffect(() => {
        Prism.highlightAll();
    })
    
    if (loading) return <Loading />;
    if (error || !data.getAnnouncement) return <NotFound />;

    return (
        <main id='announcement' className="container mx-auto py-10 overflow-auto p-5">
            <header>
                <h1 className="text-3xl font-bold">{data.getAnnouncement.title}</h1>
            </header>
            <section className="text-slate flex gap-1">
                <p>{t('announcement.announcedBy')}</p> 
                <Link to={`/profile/${data.getAnnouncement.createdBy}`} className="text-default-500">
                    {data.getAnnouncement.createdBy}
                </Link>
            </section>
            <article className='mt-5 whitespace-break-spaces' dangerouslySetInnerHTML={{ __html: data.getAnnouncement.content }}></article>
        </main>
    );
};