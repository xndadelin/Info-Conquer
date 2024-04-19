import {useQuery, gql} from "@apollo/client";
import {Avatar, Card, CardBody, TableRow, TableCell, Button, Listbox, ListboxItem, Table, TableColumn, TableHeader, TableBody, Chip} from "@nextui-org/react";
import {Link} from "react-router-dom";
import { Loading } from "../components/Loading";
//get top problems amd most based users from the database
const topProblems = [
    {
        name: "Two Sum",
        difficulty: "Easy",
        tags: ["Array", "Hashing"],
        rateSuccess: "80%",
    },
    {
        name: "Add Two Numbers",
        difficulty: "Medium",
        tags: ["Linked List", "Math"],
        rateSuccess: "70%",
    },
    {
        name: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        tags: ["String", "Sliding Window"],
        rateSuccess: "60%",
    }
]
const newAnnouncements = gql`
    query getAnnouncements {
        getAnnouncements {
                title
                content
                createdBy
            }
        }
`
export const Homepage = () => {
    const getAnnouncements = useQuery(newAnnouncements)
    if(getAnnouncements.loading) return <Loading/>
    return (
       <div className="container flex flex-col px-5 mx-auto mt-20 gap-10">
        <div className="flex flex-row gap-2 max-md:flex-col justify-between max-md:justify-start">
            <div className="flex flex-col gap-5 flex-1">
                    <div className="text-5xl text-white font-extrabold">
                    🚀 Welcome to{' '}
                    <span className="from-[#ed3131] to-[#f9f7f5] cursor-pointer bg-clip-text text-transparent bg-gradient-to-b">
                        InfoConquer!
                    </span>{' '}
                    Your ultimate hub for problem-solving!
                    </div>
                    <span>InfoConquer is dedicated to everyone who wants to learn programming by solving problems, reading articles, and participating in a forum-style community that encourages collaboration, knowledge-sharing, and skill development. Start conquering today!</span>
            </div>
            <div className="flex-1 flex flex-col items-end pt-4">
               <p className="text-2xl font-bold">You can start solving problems by clicking <Link className="text-default-500" to={'/problems'}>here</Link> and choose!</p>
               <div className="flex flex-row gap-2 mt-4">
                     <Button size="small" color="default">
                        <Link to="/problems">Solve problems</Link>
                     </Button>
                    <Button size="small" color="default">
                        <Link to="/articles">Read articles</Link>
                    </Button>
                </div> 
            </div>
        </div>
        <p className="text-3xl font-bold">Newest annoncements</p>
        <div className="flex flex-col gap-5 w-[50%] max-md:w-[100%] mb-5">
            {getAnnouncements.data.getAnnouncements.map((announcement, index) => (
                <Card key={index}>
                    <CardBody>
                        <p className="text-2xl font-bold">{announcement.title}</p>
                        <p className="text-slate">Announcement by <Link to={`/profile/${announcement.createdBy}`} className="text-default-500">{announcement.createdBy}</Link></p>
                        <div dangerouslySetInnerHTML={{__html: announcement.content.slice(0, 500) + '...' + `<a target='_blank' style='color: rgb(51,102,204);' href='/announcement/${announcement.title}'>Vezi mai multe</a>`}}></div>
                    </CardBody>
                </Card>
            ))}
        </div>
       </div>
    )
}