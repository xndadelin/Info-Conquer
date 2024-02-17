import {
    Button, Chip, Input,
    Modal, ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader, Select, SelectItem, Spinner,
    useDisclosure
} from "@nextui-org/react";
import {useContext, useEffect, useState} from "react";
import {useRef} from "react";
import 'react-quill/dist/quill.snow.css'
import {UserContext} from "../context/UserContext";
import {gql, useMutation, useQuery} from "@apollo/client";
import {Editor} from '@tinymce/tinymce-react'
import {Posts} from "../components/Posts";
export const Forum = () => {
    const forumPostMutation = gql`
        mutation Mutation($content: String, $category: String, $title: String) {
          forumPost(content: $content, category: $category, title: $title) {
            error {
              message
            }
            success
          }
        }
    `
    const [forumPost, {data, loading, error} ] = useMutation(forumPostMutation)
    const onHandlePost = async() => {
        await forumPost({variables: {content, category, title}})
    }
    useEffect(() => {
        if(data && !data.forumPost){
            window.location.reload()
        }
    }, [data])
    const {onOpen, onClose, isOpen} = useDisclosure()
    const [title, setTitle] = useState()
    const [category, setCategory] = useState()
    const categories = ['Help', 'Solutions', 'Idea', 'Random', 'Other']
    const [content, setContent] = useState()
    const {user} = useContext(UserContext)
    return (
        <div className="container mx-auto py-10 px-5">
            <div className="flex flex-col">
                {user.getUser ? (
                    <div className="flex flex-wrap justify-between">
                        <div className="flex flex-col">
                            <div className="text-2xl">Hello, {user.getUser.username}!</div>
                            <p className="text-default-500">This is a forum where you can post ideas, solutions, and questions!</p>
                        </div>
                        <Button onClick={onOpen} className="mt-5" variant="flat">Post</Button>
                    </div>
                ) : (
                    <Chip color="danger" variant="flat">You have to be logged in order to post something!</Chip>
                ) }
            </div>
            <Modal size="5xl" hideCloseButton isOpen={isOpen}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-5">
                        <p className="text-3xl font-bold">Post something!</p>
                    </ModalHeader>
                    <ModalBody>
                        <Input variant="flat" label="Title" placeholder="Write a title for your post" onChange={(e) => setTitle(e.target.value)}/>
                        <Select required placeholder="Choose a category" onChange={(e) => setCategory(e.target.value)}>
                            {categories.map((category) => (
                                <SelectItem key={category}>{category}</SelectItem>
                            ))}
                        </Select>
                        {data && data.forumPost && data.forumPost.error && data.forumPost.error.message && (
                            <Chip variant="flat" color="danger">{data.forumPost.error.message}</Chip>
                        )}
                        <Editor
                            value={content}
                            onEditorChange={(e) => setContent(e)}
                            apiKey={process.env.REACT_APP_TINY_API}
                            initialValue=""
                            init={{
                                height: 500,
                                menubar: false,
                                plugins: ['']
                            }}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={onClose} variant="flat">Close</Button>
                        <Button endContent={loading ? <Spinner color="white" size="sm"/> : ''} onClick={onHandlePost} type="submit" color="success" variant="flat">Submit</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Posts/>
        </div>
    )
}