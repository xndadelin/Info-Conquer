import { gql, useQuery } from '@apollo/client';
import { Loading } from '../components/Loading';
import { Card, CardHeader } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Articles = () => {
    const { t } = useTranslation(); 
    const getArticles = gql`
        query getArticles {
            getArticles {
                _id
                createdAt
                creator
                dislikes
                likes
                title
            }
        }
    `;

    const { data, loading } = useQuery(getArticles);

    if (loading) return <Loading />;

    return (
        <div className="container mx-auto p-5 h-screen">
            <p className="text-5xl font-extrabold">{t('articles.title')}</p>
            <div className="flex flex-wrap gap-5 mt-5">
                {data.getArticles.map((article, index) => (
                    <Card key={index} className='w-screen'>
                        <CardHeader className='flex flex-col items-start'>
                            <Link to={`/articles/${article._id}`}><p className="text-3xl font-extrabold">{article.title}</p></Link>
                            <Link to={`/profile/${article.creator}`}><p className="text-lg">{t('articles.by')} {article.creator}</p></Link> 
                            <p className="text-lg">{t('articles.on')} {new Date(+article.createdAt).toLocaleString()}</p>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
};
