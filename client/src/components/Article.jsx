import {gql, useQuery} from '@apollo/client'
import { useParams } from 'react-router-dom'
import { NotFound } from '../pages/NotFound'
import { Loading } from './Loading'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, useDisclosure } from '@nextui-org/react'
import { useState } from 'react'
import { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { useMutation } from '@apollo/client'
import { Editor } from '@tinymce/tinymce-react'
import { Input, Chip } from '@nextui-org/react'
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
const editArticle = gql`
    mutation EditArticle($id: String, $content: String, $tags: [String], $title: String) {
        editArticle(id: $id, content: $content, tags: $tags, title: $title) {
            success
        }
    }
`
export const Article = () => {
    const {id} = useParams()
    const {onOpenChange, isOpen, onClose} = useDisclosure()
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
            console.log(error)
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
        }
    })
    const {user} = useContext(UserContext)
    const [likes, setLikes] = useState(0)
    const [dislikes, setDislikes] = useState(0)
    const [disabledLike, setDisabledLike] = useState(false)
    const [disabledDislike, setDisabledDislike] = useState(false)
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')
    const [tags, setTags] = useState([])
    const [edit, {data: dataEdit, loading: loadingSave, error}] = useMutation(editArticle, {
        variables: {
            id,
            content,
            title,
            tags
        }, onCompleted: (data) => {
            if(data.editArticle.success){
                onClose()
            }
        }
    })
    const [tag, setTag] = useState('')
    const onAddTag = () => {
        setTags([...tags, tag])
        setTag('')
    }
    const onDeleteTag = (tag) => {
        setTags(tags.filter((i) => i !== tag))
    }
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
            setTags(data.getArticle.tags.length != 0 ? data.getArticle.tags : [])    
        }
    })
    const handleSave = () => {
        edit()
    }
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
                        {user.getUser && user.getUser.admin && <Button variant='flat' onClick={onOpenChange} color='warning'>Edit</Button>}
                        <Modal size='4xl' isOpen={isOpen} hideCloseButton>
                            <ModalContent className='p-3'>
                                <ModalHeader className='p-1'>Edit article</ModalHeader>
                                <Input variant='flat' className='mt-5' onChange={(e) => setTitle(e.target.value)} value={title} label="Title"/>
                                <Input
                                    label="Tags"
                                    endContent={<Button disabled={tag === ''} variant='flat' color='success' onClick={onAddTag}>Add</Button>}
                                    value={tag}
                                    onChange={(e) => setTag(e.target.value)}
                                    className='my-5'
                                />
                                <div className="flex flex-wrap gap-2 mb-5">
                                    {tags && tags.map((tag, index) => (
                                        <Chip className='cursor-pointer' key={index} onClick={() => onDeleteTag(tag)}>{tag}</Chip>
                                    ))}
                                </div>
                                <Editor
                                    value={content}
                                    onEditorChange={(e) => setContent(e)}
                                    apiKey={process.env.REACT_APP_TINY_API}
                                    init={{
                                        height: 500,
                                        menubar: false,
                                        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker',
                                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                                        skin: 'oxide-dark',
                                        content_css: 'tinymce-5-dark',
                                    }}
                                />
                                <ModalFooter>
                                    <Button onClick={onClose} variant='flat' color='danger'>Close</Button>
                                    <Button onClick={() => {handleSave();}} endContent={loadingSave ? <Spinner size='sm' color='secondary'/> : '' }  variant='flat' color='success'>Save</Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </div>
                </div>
                <p className="mt-5" dangerouslySetInnerHTML={{__html: content}}></p>
            </div>
        </div>
    )
}
