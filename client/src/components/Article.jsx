import {gql, useQuery} from '@apollo/client'
import { Link, useParams } from 'react-router-dom'
import { NotFound } from '../pages/NotFound'
import { Loading } from './Loading'
import { Button } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { useMutation } from '@apollo/client'
import Prism from "prismjs"
import "prismjs/themes/prism-tomorrow.css"
const getArticle = gql`
    query GetArticle($id: String) {
        getArticle(id: $id) {
            content
            createdAt
            creator
            hasDisliked
            dislikes
            hasLiked
            likes
            title
            tags
            updatedAt
        }
    }
`
const likeArticle = gql`
    mutation LikeArticle($id: String) {
        likeArticle(id: $id) {
            success
        }
    }
`
const dislikeArticle = gql`
    mutation DislikeArticle($id: String) {
        dislikeArticle(id: $id) {
            success
        }
    }
`
export const Article = () => {
    const {id} = useParams()
    const [like] = useMutation(likeArticle, {
        variables: {
            id
        },
        onCompleted: (data) => {
            if(data.likeArticle.success){
                setLikes(likes + 1)
                if(disabledDislike) setDislikes(dislikes - 1)
                setDisabledLike(true)
                setDisabledDislike(false)
            }
        },
        onError: (error) => {
            //do nothing for now
        }
    })
    const [dislike] = useMutation(dislikeArticle, {
        variables: {
            id
        },
        onCompleted: (data) => {
            if(data.dislikeArticle.success){
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
    const {user} = useContext(UserContext)
    const [likes, setLikes] = useState(0)
    const [dislikes, setDislikes] = useState(0)
    const [disabledLike, setDisabledLike] = useState(false)
    const [disabledDislike, setDisabledDislike] = useState(false)
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')
    const {data, loading} = useQuery(getArticle, {
        variables: {
            id
        }, onCompleted: (data) => {
            setLikes(data.getArticle.likes.length)
            setDislikes(data.getArticle.dislikes.length)
            if(data.getArticle.hasLiked) setDisabledLike(true)
            if(data.getArticle.hasDisliked) setDisabledDislike(true)
            setContent(data.getArticle.content)
            setTitle(data.getArticle.title)
        }
    })
    useEffect(() => {
        Prism.highlightAll()
    }, [])
    if(loading) return <Loading/>
    if(!data) return <NotFound/>
    return (
        <div className='container mx-auto py-10'>
            <div className='flex flex-col p-3'>
                <div className='flex justify-between flex-wrap gap-3'>
                    <div>
                        <p className="text-5xl font-extrabold">{title}</p>
                        <p className="text-lg">By {data.getArticle.creator}</p>
                        <p className="text-lg">On {new Date(+data.getArticle.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className='flex gap-5'>
                            <Button onClick={like} variant='flat' color='success' disabled={!user.getUser || disabledLike}>Like ({likes})</Button>
                            <Button onClick={dislike} variant='flat' color='danger' disabled={!user.getUser || disabledDislike}>Dislike ({dislikes})</Button>
                        </div>
                        {user.getUser && user.getUser.admin && <Link target='_blank' to={`/articles/edit/${id}`}><Button variant='flat' className='w-full' color='warning'>Edit</Button></Link>}
                    </div>
                </div>
                <p className="mt-5" dangerouslySetInnerHTML={{__html: content}}></p>
            </div>
        </div>
    )
}
