import {gql, useQuery} from '@apollo/client'
import { Loading } from '../components/Loading'
import { Card, CardHeader } from '@nextui-org/react'
import { Link } from 'react-router-dom'
export const Articles = () => {
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
    `
    const {data, loading} = useQuery(getArticles)
    if(loading) return <Loading/>
    return (
        <div className="container mx-auto p-5 h-screen">
            <p className="text-5xl font-extrabold">Articles</p>
            <div className="flex flex-wrap gap-5 mt-5">
                {data.getArticles.map((article, index) => (
                   <Card className='w-screen'>
                        <CardHeader className='flex flex-col items-start'>
                            <Link to={`/articles/${article._id}`}><p className="text-3xl font-extrabold">{article.title}</p></Link>
                            <Link to={`/profile/${article.creator}`}><p className="text-lg">By {article.creator}</p></Link>
                            <p className="text-lg">On {new Date(+article.createdAt).toLocaleString()}</p>
                        </CardHeader>
                   </Card>
                ))}
            </div>
        </div>
    )
}