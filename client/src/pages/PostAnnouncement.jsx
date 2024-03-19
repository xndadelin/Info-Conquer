import { useContext, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { Button, Chip, Input } from '@nextui-org/react'
import { gql, useMutation } from '@apollo/client'
import { UserContext } from '../context/UserContext'
import { NotFound } from './NotFound'
const postAnnouncementQ = gql`
    mutation postAnnouncement($title: String, $content: String) {
        postAnnouncement(title: $title, content: $content) {
            success
        }
    }

`
export const PostAnnouncement = () => {
    const {user} = useContext(UserContext)
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')
    const [isError, setIsError] = useState(false)
    const [postAnnouncement, {data, error: error, loading}] = useMutation(postAnnouncementQ, {
        onCompleted: (data) => {
            if(data.postAnnouncement.success){
                window.location.href = `/announcement/${title}`
                setContent('')
                setTitle('')
            }
        },
        onError: (error) => {
            setIsError(true)
        }
    })
    if(!user.getUser.admin){
        return <NotFound/>
    }
    return (
        <div className="container mx-auto py-10">
            <p className="text-3xl font-bold mb-5">Post an announcement!</p>
            {isError && (
                <Chip className='mb-5' color="danger" variant='flat'>{error.message}</Chip>
            )} 
            <Input className='mb-5' label="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
            <Editor
                value={content}
                onEditorChange={(e) => setContent(e)}
                apiKey={process.env.REACT_APP_TINY_API}
                initialValue=""
                init={{
                    height: 500,
                    menubar: false,
                    plugins: 'anchor autolink charmap codesample emoticons codesample image link lists media searchreplace table visualblocks wordcount linkchecker',
                    toolbar: 'undo redo | blocks fontfamily fontsize codesample | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                    skin: 'oxide-dark',
                    content_css: 'tinymce-5-dark',
                }}
            />
            <div className='flex justify-end'>
                <Button color='success' variant='flat' className='mt-5' onClick={() => {postAnnouncement({variables: {title, content}})}}>Post</Button>
            </div>
        </div>  
    )
}