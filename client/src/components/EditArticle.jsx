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
const editArticle = gql`
    mutation EditArticle($id: String, $content: String, $tags: [String], $title: String) {
        editArticle(id: $id, content: $content, tags: $tags, title: $title) {
            success
        }
    }
`

export const EditArticle = () => {
    const {id} = useParams()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [tags, setTags] = useState([])
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
            setContent(data.getArticle.content)
            setTitle(data.getArticle.title)
            setTags(data.getArticle.tags.length != 0 ? data.getArticle.tags : [])    
        }
    })
    const {user} = useContext(UserContext)
    const [edit, {data: dataEdit, loading: loadingSave, error}] = useMutation(editArticle, {
        variables: {
            id,
            content,
            title,
            tags
        }, onCompleted: (data) => {
            if(data.editArticle.success){
                window.location.href = `/articles/${id}`
            }
        }
    })
    if(!user.getUser.admin)
        return <NotFound/>
    const handleSave = () => {
        edit()
    }
    if(loading) return <Loading/>
    if(error) return <NotFound/>
    return (
        <div className='container mx-auto py-5'>
            <p className='text-2xl font-bold'>Edit Article</p>
            <Input variant='flat' className='mt-5' onChange={(e) => setTitle(e.target.value)} value={title} label="Title"/>
            <Input label="Tags" endContent={<Button disabled={tag === ''} variant='flat' color='success' onClick={onAddTag}>Add</Button>} value={tag} onChange={(e) => setTag(e.target.value)} className='my-5'/>
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
                    height: 1000,
                    menubar: false,
                    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker code ',
                    toolbar: 'undo redo | blocks fontfamily fontsize | codesample | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat | code',
                    skin: 'oxide-dark',
                    content_css: 'tinymce-5-dark',
                }}
            />
            <div className='flex justify-end gap-5 mt-5'>
                <Button variant='flat' color='danger'>Close</Button>
                <Button onClick={() => {handleSave();}} endContent={loadingSave ? <Spinner size='sm' color='secondary'/> : '' }  variant='flat' color='success'>Save</Button>
            </div>
        </div>
    )
}