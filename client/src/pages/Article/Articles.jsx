import { useQuery } from '@apollo/client';
import { Loading } from '../../components/Miscellaneous/Loading';
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GET_ARTICLES } from '../../utils/Queries';

export const Articles = () => {
    const { t } = useTranslation();
    const { data, loading } = useQuery(GET_ARTICLES);

    if (loading) return <Loading />;

    return (
        <main className="container mx-auto p-8 min-h-screen bg-gray-900 py-20">
            <h1 className="text-5xl font-extrabold text-center mb-10 text-gray-100">{t('articles.title')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.getArticles.map((article, index) => (
                    <Card key={index} className="bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="bg-gray-700 p-4">
                            <Link to={`/articles/${article._id}`}>
                                <h2 className="text-2xl font-bold text-gray-100 hover:text-blue-300 transition-colors duration-200">
                                    {article.title}
                                </h2>
                            </Link>
                        </CardHeader>
                        <CardBody className="p-4">
                            <p className="text-gray-300 line-clamp-3">{article.excerpt || 'No excerpt available'}</p>
                        </CardBody>
                        <CardFooter className="p-4 bg-gray-700 flex justify-between items-center">
                            <Link to={`/profile/${article.creator}`}>
                                <p className="text-sm font-medium text-blue-300 hover:text-blue-100">
                                    {t('articles.by')} {article.creator}
                                </p>
                            </Link>
                            <p className="text-sm text-gray-400">
                                {t('articles.on')} {new Date(+article.createdAt).toLocaleDateString()}
                            </p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </main>
    );
};