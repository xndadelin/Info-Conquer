import { useParams } from "react-router-dom"
import { gql, useQuery } from "@apollo/client"
import { Loading } from "../components/Loading"
import { useState } from "react"
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Pagination, Card, CardHeader, Link } from "@nextui-org/react"
import { NotFound } from "../pages/NotFound"
import { Error } from "../components/Error"
const getContest = gql`
    query GetContest($id: String) {
        getContest(id: $id) {
            description
            endDate
            languages
            name
            startDate
            createdBy
            problems
            participants {
                username
                score
                problems
            }
            started 
            ended
        }
    }

`
export const Contest = () => {
    const {id} = useParams()
    const [page, setPage] = useState(1)
    const [error, setError] = useState('')
    const participantsPerPage = 20
    const {data, loading} = useQuery(getContest, {
        variables: {
            id
        },
        onCompleted: (data) => {
            console.log(data)
        },
        onError: (error) => {
            setError(error.message)
        }
    })
    if(loading) return <Loading/>
    if(!data) return <NotFound/>
    if(error) return <Error error={error}/>
    return (
        <div className="container mx-auto p-3 my-5 h-screen">
            <p className="text-4xl font-bold">{data.getContest.name}</p>
            <p className="text-gray-400">Created by {data.getContest.createdBy}</p>
            <p className="text-gray-400 font-bold">Start Date: {new Date(data.getContest.startDate).toLocaleString()}</p>
            <p className="text-gray-400 font-bold">End Date: {new Date(data.getContest.endDate).toLocaleString()} </p>
            <p className="text-gray-400">Languages: {data.getContest.languages.join(", ")}</p>
            <p className="text-gray-400">Description: {data.getContest.description}</p>
            <p className="text-gray-400">Problems: {data.getContest.problems.length}</p>
            <p className="text-gray-400">Participants: {data.getContest.participants.length}</p>
            <p className="text-gray-400">Has started: {data.getContest.started ? "Yes" : "No"}</p>
            <p className="text-gray-400">Has ended: {data.getContest.ended ? "Yes" : "No"}</p>
            <p className="text-2xl font-bold mt-5">Leaderboard</p>
            <Table
                isCompact
                isStriped
                className="mt-4"
                bottomContent={
                    <Pagination
                        className="mt-3 flex justify-center"
                        onChange={(page) => setPage(page)}
                        loop
                        showControls
                        total={Math.ceil(data.getContest.participants.length / participantsPerPage)}
                        initialPage={1}
                        color="danger"
                    />
                }
            >
                <TableHeader>
                    <TableColumn>Rank</TableColumn>
                    <TableColumn>Username</TableColumn>
                    {data.getContest.problems.map((problem) => (
                        <TableColumn key={problem}>{problem}</TableColumn>
                    ))}
                </TableHeader>
                <TableBody>
                    {data.getContest.participants
                        .slice((page - 1) * participantsPerPage, page * participantsPerPage)
                        .map((participant, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{participant.username}</TableCell>
                                {data.getContest.problems.map((problem) => {
                                    const score = participant.problems.find(p => p.id === problem.id)?.score || 0;
                                    return <TableCell key={problem.id}>{score}</TableCell>;
                                })}
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            {data.getContest.started || data.getContest.ended ? (
                <div>
                    <p className="text-2xl font-bold mt-5">Problems</p>
                    <div className="grid grid-cols-3 gap-2 mt-3">
                        {data.getContest.problems.map((problem) => (
                            <Card as={Link} href={`/contests/${id}/${problem}`} className="flex-1">
                                <CardHeader>
                                    {problem}
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            ): 
              <div className="text-3xl font-bold">
                
              </div>
            }
        </div>
    )
}