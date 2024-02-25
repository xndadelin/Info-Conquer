import { UserContext } from '../context/UserContext'
import { useContext, useState } from 'react'
import { NotFound } from './NotFound'
import { Editor } from '@tinymce/tinymce-react'
import { Input, Button, Chip } from '@nextui-org/react'
import {gql, useMutation} from '@apollo/client'
export const PublishArticle = () => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [tags, setTags] = useState('')
    const [tag, setTag] = useState('')
    const [error, setError] = useState('')
    const onAddTag = () => {
        setTags([...tags, tag])
        setTag('')
    }
    const onDeleteTag = (tag) => {
        console.log(tag)
        setTags(tags.filter((i) => i !== tag))
    }
    const publishGql = gql`
        mutation Mutation($title: String, $content: String, $tags: [String]) {
            publishArticle(title: $title, content: $content, tags: $tags) {
                success
            }
        }
    `
    const [publishArticle, {data, loading}] = useMutation(publishGql, {
        variables: {
            title,
            content,
            tags
        }, onError: (error) => {
            setError(error.message)
        }
    })
    const {user} = useContext(UserContext)
    if(!user || !user.getUser || !user.getUser.admin)
        return <NotFound/>
    return (
        <div className="container mx-auto p-5 h-screen">
            <div className='flex flex-col gap-5'>
                <p className="text-5xl font-extrabold">Publish an article</p>
                <Input variant='flat' onChange={(e) => setTitle(e.target.value)} value={title} label="Title"/>
                <Input
                    label="Tags"
                    endContent={<Button disabled={tag === ''} variant='flat' color='success' onClick={onAddTag}>Add</Button>}
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                    {tags && tags.map((tag, index) => (
                        <Chip className='cursor-pointer' key={index} onClick={() => onDeleteTag(tag)}>{tag}</Chip>
                    ))}
                </div>
                <p className="text-2xl font-bold">Content</p>
                <Editor
                    value={content}
                    onEditorChange={(e) => setContent(e)}
                    apiKey={process.env.REACT_APP_TINY_API}
                    initialValue=""
                    init={{
                        height: 500,
                        menubar: false,
                        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker',
                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                        skin: 'oxide-dark',
                        content_css: 'tinymce-5-dark',
                    }}
                />
            </div>
           <div className='flex mt-5 justify-between'>
                {error &&  <Chip color='danger' variant='flat'>{error}</Chip>}
                <Button className='ml-auto' loading={loading} onClick={publishArticle} variant='flat' color='success'>Publish</Button>
           </div>
        </div>
    )
}   