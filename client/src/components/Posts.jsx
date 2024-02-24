import {gql, useQuery} from "@apollo/client";
import {Loading} from "./Loading";
import {Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader} from "@nextui-org/react";
import {Link} from "react-router-dom";
export const Posts = () => {
    const postsgql = gql`
        query GetForumPosts {
          getForumPosts {
            _id
            category
            content
            creator
            dislikes
            likes
            title
            createdAt
          }
        }
    `
    const {data, loading, error} = useQuery(postsgql);
    if(loading){
        return <Loading/>
    }
    const handleUpVote = (id) => {
        console.log(id)
    }
    console.log(data)
    //solution for nested replies?????????, or just throw it
    return (
        <div className="mt-5 grid gap-4">
            {data.getForumPosts.map((post) => (
                <Card>
                    <CardHeader className="flex flex-col items-start">
                        <p className="text-4xl">
                            <Link to={`/forum/posts/${post.title}`}>
                                {post.title}
                            </Link>
                        </p>
                        <p className="text-default-500">Posted by {post.creator} on  {new Date(post.createdAt).toLocaleDateString()}</p>
                    </CardHeader>
                    <CardBody className="max-h-[400px] overflow-hidden text">
                        <div dangerouslySetInnerHTML={{__html: post.content}}></div>
                    </CardBody>
                    <CardFooter>
                        <ButtonGroup>
                            <Button onClick={() => handleUpVote(post._id)}>
                                <svg height={25} fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M318 177.5c3.8-8.8 2-19-4.6-26l-136-144C172.9 2.7 166.6 0 160 0s-12.9 2.7-17.4 7.5l-136 144c-6.6 7-8.4 17.2-4.6 26S14.4 192 24 192H96l0 288c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32l0-288h72c9.6 0 18.2-5.7 22-14.5z"/></svg>
                            </Button>
                            <Button>
                                <svg height={25} fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M2 334.5c-3.8 8.8-2 19 4.6 26l136 144c4.5 4.8 10.8 7.5 17.4 7.5s12.9-2.7 17.4-7.5l136-144c6.6-7 8.4-17.2 4.6-26s-12.5-14.5-22-14.5l-72 0 0-288c0-17.7-14.3-32-32-32L128 0C110.3 0 96 14.3 96 32l0 288-72 0c-9.6 0-18.2 5.7-22 14.5z"/></svg>
                            </Button>
                        </ButtonGroup>
                        <Button className="ml-auto">
                            <Link to={`/forum/posts/${post._id}`}>See post</Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}