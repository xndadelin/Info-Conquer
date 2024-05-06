import { Link, useParams } from "react-router-dom"
import { gql, useQuery } from "@apollo/client"
import { Loading } from "../components/Loading"
import { useState } from "react"
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Pagination, Tab } from "@nextui-org/react"
import { NotFound } from "../pages/NotFound"
const getContest = gql`
    query GetContest($id: String) {
        getContest(id: $id) {
            _id
            description
            endDate {
                minute
                day
                hour
                month
                year
            }
            languages
            name
            startDate {
                day
                hour
                minute
                year
                month
            }
            createdBy,
            problems {
                id
                difficulty
            },
            participants {
                username
                score
            },
            hasEnded,
            hasStarted,
        }
    }

`
export const Contest = () => {
    const {id} = useParams()
    const [page, setPage] = useState(1)
    const {data, error, loading} = useQuery(getContest, {
        variables: {
            id
        },
        onCompleted: (data) => {
            console.log(data)
        },
        onError: (error) => {
            console.log(error)
        }
    })
    if(loading) return <Loading/>
    if(!data) return <NotFound/>
    return (
        <div className="container mx-auto p-3 my-5">
            <p className="text-4xl font-bold">{data.getContest.name}</p>
            <p className="text-gray-400">Created by {data.getContest.createdBy}</p>
            <p className="text-gray-400">Start Date: {data.getContest.startDate.month}/{data.getContest.startDate.day}/{data.getContest.startDate.year} {data.getContest.startDate.hour}:{data.getContest.startDate.minute}</p>
            <p className="text-gray-400">End Date: {data.getContest.endDate.month}/{data.getContest.endDate.day}/{data.getContest.endDate.year} {data.getContest.endDate.hour}:{data.getContest.endDate.minute}</p>
            <p className="text-gray-400">Languages: {data.getContest.languages.join(", ")}</p>
            <p className="text-gray-400">Description: {data.getContest.description}</p>
            <p className="text-gray-400">Problems: {data.getContest.problems.length}</p>
            <p className="text-gray-400">Participants: {data.getContest.participants.length}</p>
            <p className="text-gray-400">Has started: {data.getContest.hasStarted ? "Yes" : "No"}</p>
            <p className="text-gray-400">Has ended: {data.getContest.hasEnded ? "Yes" : "No"}</p>
            <p className="text-2xl font-bold mt-5">Leaderboard</p>
            <Table isCompact isStriped className="mt-4" bottomContent={
                <Pagination className="mt-3 flex justify-center" onChange={(page) => setPage(page)} loop showControls total={Math.ceil(data.getContest.participants.length/20)} initialPage={1}></Pagination>
            }>
                <TableHeader>
                    <TableColumn>Index</TableColumn>
                    <TableColumn>User</TableColumn>
                    <TableColumn>Score</TableColumn>
                </TableHeader>
                <TableBody>
                    {data.getContest.participants.slice((page - 1)*20, page*20).map((participant, index) => (
                        <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{participant.username}</TableCell>
                            <TableCell>{participant.score ? participant.score : 0}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <p className="text-2xl font-bold mt-5">Problems</p>
            <Table isCompact isStriped className="mt-4">
                <TableHeader>
                    <TableColumn>Index</TableColumn>
                    <TableColumn>Title</TableColumn> 
                    <TableColumn>Difficulty</TableColumn>
                </TableHeader>
                <TableBody>
                    {data.getContest.problems.slice((page - 1)*20, page*20).map((problem, index) => (
                        <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                                <Link to={`/problems/${problem.id}`}>
                                    {problem.id}
                                </Link>
                            </TableCell>
                            <TableCell>{problem.difficulty}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}