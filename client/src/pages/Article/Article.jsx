import { useQuery } from '@apollo/client'
import { Link, useParams } from 'react-router-dom'
import { NotFound } from '../../components/Miscellaneous/NotFound'
import { Loading } from '../../components/Miscellaneous/Loading'
import { Button } from '@nextui-org/react'
import { useState } from 'react'
import { useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import { useMutation } from '@apollo/client'
import { useTranslation } from 'react-i18next';
import { DISLIKE_ARTICLE, LIKE_ARTICLE, GET_ARTICLE } from '../../utils/Queries'

export const Article = () => {
    const { id } = useParams()
    const [like] = useMutation(LIKE_ARTICLE, {
        variables: {
            id
        },
        onCompleted: (data) => {
            if (data.likeArticle.success) {
                setLikes(likes + 1)
                if (disabledDislike) setDislikes(dislikes - 1)
                setDisabledLike(true)
                setDisabledDislike(false)
            }
        },
        onError: (error) => {
            //do nothing for now
        }
    })
    const [dislike] = useMutation(DISLIKE_ARTICLE, {
        variables: {
            id
        },
        onCompleted: (data) => {
            if (data.dislikeArticle.success) {
                setDislikes(dislikes + 1)
                setLikes(likes - 1)
                setDisabledDislike(true)
                setDisabledLike(false)
            }
        },
        onError: (error) => {
            //do nothing for now
        }
    })
    const { user } = useContext(UserContext)
    const [likes, setLikes] = useState(0)
    const [dislikes, setDislikes] = useState(0)
    const [disabledLike, setDisabledLike] = useState(false)
    const [disabledDislike, setDisabledDislike] = useState(false)
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')
    const { t } = useTranslation()
    const { data, loading } = useQuery(GET_ARTICLE, {
        variables: {
            id
        }, onCompleted: (data) => {
            setLikes(data.getArticle.likes.length)
            setDislikes(data.getArticle.dislikes.length)
            if (data.getArticle.hasLiked) setDisabledLike(true)
            if (data.getArticle.hasDisliked) setDisabledDislike(true)
            setContent(data.getArticle.content)
            setTitle(data.getArticle.title)
        }
    })
    if (loading) return <Loading />
    if (!data) return <NotFound />
    return (
        <main className='container mx-auto py-10' id="announcement">
            <section className='flex flex-col p-3'>
                <header className='flex justify-between flex-wrap gap-3'>
                    <div>
                        <h1 className="text-5xl font-extrabold">{title}</h1>
                        <p className="text-lg">{t('article.by')} {data.getArticle.creator}</p>
                        <p className="text-lg">{t('article.on')} {new Date(+data.getArticle.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col gap-2" role="group" aria-label="Article actions">
                        {user.getUser && (
                            <div className='flex gap-5'>
                                <Button
                                    onClick={like}
                                    aria-label={`Like article (${likes} likes)`}
                                    variant='flat'
                                    color='success'
                                    disabled={!user.getUser || disabledLike}
                                >
                                    {t('article.like')} ({likes})
                                </Button>
                                <Button
                                    onClick={dislike}
                                    aria-label={`Dislike article (${dislikes} dislikes)`}
                                    variant='flat'
                                    color='danger'
                                    disabled={!user.getUser || disabledDislike}
                                >
                                    {t('article.dislike')} ({dislikes})
                                </Button>
                            </div>
                        )}
                        {user.getUser && user.getUser.admin && (
                            <Link
                                aria-label='Edit article'
                                target='_blank'
                                to={`/articles/edit/${id}`}
                            >
                                <Button variant='flat' className='w-full' color='warning'>
                                    {t('article.edit')}
                                </Button>
                            </Link>
                        )}
                    </div>
                </header>
            </section>
            <article className="mt-5" dangerouslySetInnerHTML={{ __html: content }}></article>
        </main>
    )
}