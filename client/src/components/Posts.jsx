import {gql, useQuery} from "@apollo/client";
import {Loading} from "./Loading";
import {Avatar, Card, CardBody, CardHeader} from "@nextui-org/react";
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
          }
        }
    `
    const {data, loading, error} = useQuery(postsgql);
    if(loading){
        return <Loading/>
    }
    //solution for nested replies?????????
    return (
        <div className="mt-5">
            {data.getForumPosts.map((post) => (
                <Card>
                    <CardHeader className="flex flex-col items-start">
                        <p className="text-4xl">{post.title}</p>
                        <p className="text-default-500">Posted by: {post.creator}</p>
                    </CardHeader>
                    <CardBody>
                        <div dangerouslySetInnerHTML={{__html: post.content}}></div>
                    </CardBody>
                </Card>
            ))}
        </div>
    )
}