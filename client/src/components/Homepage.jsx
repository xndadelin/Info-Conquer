import {useQuery, gql} from "@apollo/client";
import {Avatar, Card, CardBody, TableRow, TableCell, Button, Listbox, ListboxItem, Table, TableColumn, TableHeader, TableBody, Chip} from "@nextui-org/react";
import {Link} from "react-router-dom";
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
export const Homepage = () => {
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
       <div className="grid grid-cols-2 max-md:grid-cols-1 gap-2">
         <div className="flex flex-col mb-10 flex-1">
            <p className="text-5xl font-extrabold">Popular problems</p>
            <Table className="mt-4">
                <TableHeader>
                    <TableColumn>Problem</TableColumn>
                    <TableColumn>Difficulty</TableColumn>
                    <TableColumn>Tags</TableColumn>
                    <TableColumn>Rate success</TableColumn>
                </TableHeader>
                <TableBody>
                    {topProblems.map((problem, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Link to={`/problems/${problem.name}`}>
                                    <span>{problem.name}</span>
                                </Link>
                            </TableCell>
                            <TableCell>{problem.difficulty}</TableCell>
                            <TableCell>
                                <div className="flex flex-row gap-2">
                                    {problem.tags.map((tag, index) => (
                                        <Chip>{tag}</Chip>
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell>{problem.rateSuccess}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
        <div className="flex flex-col mb-10 flex-1">
            <p className="text-5xl font-extrabold">Most based users</p>
            <Table className="mt-4">
                <TableHeader>
                    <TableColumn>User</TableColumn>
                    <TableColumn>Problems solved</TableColumn>
                    <TableColumn>Rate success</TableColumn>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <Link to="/users/1">
                                <div className="flex flex-row gap-2 items-center">
                                    <Avatar size="small"></Avatar>
                                    <span>John Doe</span>
                                </div>
                            </Link>
                        </TableCell>
                        <TableCell>100</TableCell>
                        <TableCell>80%</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Link to="/users/2">
                                <div className="flex flex-row gap-2 items-center">
                                    <Avatar size="small"></Avatar>
                                    <span>Jane Doe</span>
                                </div>
                            </Link>
                        </TableCell>
                        <TableCell>90</TableCell>
                        <TableCell>70%</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Link to="/users/3">
                                <div className="flex flex-row gap-2 items-center">
                                    <Avatar size="small"></Avatar>
                                    <span>John Doe</span>
                                </div>
                            </Link>
                        </TableCell>
                        <TableCell>80</TableCell>
                        <TableCell>60%</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
       </div>
       </div>
    )
}