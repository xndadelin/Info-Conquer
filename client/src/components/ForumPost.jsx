import {gql, useMutation, useQuery} from "@apollo/client";
import {NotFound} from "../pages/NotFound";
import {Loading} from "./Loading";
import {useParams} from "react-router-dom";
import {Chip} from "@nextui-org/react";
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Modal, ModalBody,
    ModalContent, ModalFooter, ModalHeader, Spinner,
    useDisclosure
} from "@nextui-org/react";
import {Editor} from "@tinymce/tinymce-react";
import {useEffect, useState} from "react";

export const ForumPost = () => {
    const [errorReply, setErrorReply] = useState('')
    const [contentReply, setContentReply] = useState('')
    const {isOpen, onOpen, onClose} = useDisclosure()
    const {id} = useParams()
    const forumReplyGql = gql`
        mutation Mutation($content: String, $id: String) {
          postForumReply(content: $content, id: $id) {
            error {
              code
              message
            }
            success
          }
        }
    `
    const forumPostGql = gql`
        query GetForumPosts($id: String) {
          getForumPost(id: $id) {
            _id
            category
            content
            createdAt
            dislikes
            creator
            likes
            replies {
              content
              createdAt
              creator
              dislikes
              likes
            }
            title
          }
        }
    `
    const {data, loading, error} = useQuery(forumPostGql, {
        variables: {
            id
        }
    });
    const [submitReply, {data: responseReply, loading: loadingReply}] = useMutation(forumReplyGql, {
        variables: {
            content: contentReply,
            id
        },
        onError: (e) => {
            setErrorReply(e.message)
        }
    })
    useEffect(() => {
        if(responseReply){
            onClose()
        }
    }, [responseReply])
    if(loading){
        return <Loading/>
    }
    if(!data || !data.getForumPost){
        return <NotFound/>
    }
    const handleUpVote = (id) => {
        console.log(id)
    }
    const handleReply = async() => {
        await submitReply()
    }
    //FIX DATE
    return (
        <div className="container mx-auto py-10 px-5">
            <Card>
                <CardHeader className="grid">
                    <p className="text-4xl">{data.getForumPost.title}</p>
                    <p className="text-default-500">Posted by {data.getForumPost.creator} on {new Date(data.getForumPost.createdAt).toLocaleString()}</p>
                    <p className="text-default-500">Category: {data.getForumPost.category}</p>
                </CardHeader>
                <CardBody>
                    <div dangerouslySetInnerHTML={{__html: data.getForumPost.content}}></div>
                </CardBody>
                <CardFooter>
                    <ButtonGroup>
                        <Button onClick={() => handleUpVote(data.getForumPost._id)}>
                            <svg height={25} fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M318 177.5c3.8-8.8 2-19-4.6-26l-136-144C172.9 2.7 166.6 0 160 0s-12.9 2.7-17.4 7.5l-136 144c-6.6 7-8.4 17.2-4.6 26S14.4 192 24 192H96l0 288c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32l0-288h72c9.6 0 18.2-5.7 22-14.5z"/></svg>
                        </Button>
                        <Button>
                            <svg height={25} fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M2 334.5c-3.8 8.8-2 19 4.6 26l136 144c4.5 4.8 10.8 7.5 17.4 7.5s12.9-2.7 17.4-7.5l136-144c6.6-7 8.4-17.2 4.6-26s-12.5-14.5-22-14.5l-72 0 0-288c0-17.7-14.3-32-32-32L128 0C110.3 0 96 14.3 96 32l0 288-72 0c-9.6 0-18.2 5.7-22 14.5z"/></svg>
                        </Button>
                    </ButtonGroup>
                    <Button onClick={onOpen} className="ml-auto">
                        Reply
                    </Button>
                </CardFooter>
            </Card>
            <Modal size="5xl" isOpen={isOpen} hideCloseButton>
                <ModalContent>
                    <ModalHeader>
                        <p className="text-3xl">Reply to this post!</p>
                    </ModalHeader>
                    <ModalBody>
                        {errorReply && <Chip variant="flat" color="danger">{errorReply}</Chip>}
                        <Editor
                            value={contentReply}
                            onEditorChange={(e) => setContentReply(e)}
                            apiKey={process.env.REACT_APP_TINY_API}
                            initialValue=""
                            init={{
                                height: 250,
                                menubar: false,
                                plugins: ['code'],
                                skin: 'oxide-dark',
                                content_css: 'tinymce-5-dark'
                            }}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button endContent={loadingReply ? <Spinner color="white" size="sm"/> : ''} onClick={handleReply} variant="flat"  color="success">Reply</Button>
                        <Button variant="flat" color={"danger"} onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <section className="mt-10">
                {data.getForumPost.replies.map((reply) => (
                    <Card className="mt-5">
                        <CardHeader>
                            Reply from {reply.creator} from {new Date(reply.createdAt).toLocaleDateString()}
                        </CardHeader>
                        <CardBody>
                            <div dangerouslySetInnerHTML={{__html: reply.content}}></div>
                        </CardBody>
                        <CardFooter>
                            <ButtonGroup>
                                <Button onClick={() => handleUpVote(data.getForumPost._id)}>
                                    <svg height={25} fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M318 177.5c3.8-8.8 2-19-4.6-26l-136-144C172.9 2.7 166.6 0 160 0s-12.9 2.7-17.4 7.5l-136 144c-6.6 7-8.4 17.2-4.6 26S14.4 192 24 192H96l0 288c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32l0-288h72c9.6 0 18.2-5.7 22-14.5z"/></svg>
                                </Button>
                                <Button>
                                    <svg height={25} fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M2 334.5c-3.8 8.8-2 19 4.6 26l136 144c4.5 4.8 10.8 7.5 17.4 7.5s12.9-2.7 17.4-7.5l136-144c6.6-7 8.4-17.2 4.6-26s-12.5-14.5-22-14.5l-72 0 0-288c0-17.7-14.3-32-32-32L128 0C110.3 0 96 14.3 96 32l0 288-72 0c-9.6 0-18.2 5.7-22 14.5z"/></svg>
                                </Button>
                            </ButtonGroup>
                        </CardFooter>
                    </Card>
                ))}
            </section>
        </div>
    )
}