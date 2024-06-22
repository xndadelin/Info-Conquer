import {gql, useQuery} from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import { Loading } from "./Loading";
import {Chart} from 'react-google-charts'
import { Card, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
const getStats = gql`
    query GetProblemStats($id: String) {
        getProblemStats(id: $id) {
            bestMemory {
                language
                date
                memory
                username
            }
            firstSubmissions {
                date
                language
                _id
            }
            timeExecution {
                date
                language
                timeExecutions
                username
            }
            solves {
                count
                date
            }
        }
    }
`
export const ProblemStats = () => {
    const {id} = useParams();
    const {loading, data} = useQuery(getStats, {
        variables: {
            id
        },
    })
    console.log(data)
    if(loading) return <Loading/>
    if(!data || !data.getProblemStats) return <Loading/>
    return (
        <div className="container flex-col">
            <h1 className="text-3xl font-bold mb-5 mt-5">
                📈 Insigths about this problem
            </h1>
            <Chart
                chartType="LineChart"
                data={[
                    ['Date', 'Solves'],
                    ...data.getProblemStats.solves.map((solve) => [new Date(+solve.date).toDateString(), solve.count])
                ]}
                width="100%"
                height="400px"
                legendToggle
            />
            <h1 className="text-3xl font-bold mt-5">First Submissions</h1>
            <div className="grid grid-cols-3 max-md:grid-cols-1 gap-5 mt-5">
                <Card className="p-7">
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width={100} fill="yellow" height={100} viewBox="0 0 576 512"><path d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z"/></svg>
                        {data.getProblemStats.firstSubmissions[0] && data.getProblemStats.firstSubmissions[0]._id ? <Link to={`/profile/${data.getProblemStats.firstSubmissions[0]._id }`}>{data.getProblemStats.firstSubmissions[0]._id}</Link>: 'Nobody solved this problem yet. Be the first one!'}
                    </div>
                </Card>
                <Card className="p-7">
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width={100} fill="grey" height={100} viewBox="0 0 576 512"><path d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z"/></svg>
                        {data.getProblemStats.firstSubmissions[1] && data.getProblemStats.firstSubmissions[1]._id ? <Link to={`/profile/${data.getProblemStats.firstSubmissions[1]._id }`}>{data.getProblemStats.firstSubmissions[1]._id}</Link>: 'You can be the second one to solve this problem!'}
                    </div>
                </Card>
                <Card className="p-7">
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width={100} fill="#8b4b3e" height={100} viewBox="0 0 576 512"><path d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z"/></svg>
                        {data.getProblemStats.firstSubmissions[2] && data.getProblemStats.firstSubmissions[2]._id ? <Link to={`/profile/${data.getProblemStats.firstSubmissions[2]._id }`}>{data.getProblemStats.firstSubmissions[2]._id}</Link>: 'You can be the third one to solve this problem!'}
                    </div>
                </Card>
            </div>
            <h1 className="text-3xl font-bold mt-5">Best memory usages and time executions</h1>
            <div className="grid grid-cols-2 mt-5 max-md:grid-cols-1 gap-3">
                <div>
                    <Table>
                        <TableHeader>
                            <TableColumn>Top</TableColumn>
                            <TableColumn>Username</TableColumn>
                            <TableColumn>Date</TableColumn>
                            <TableColumn>Language</TableColumn>
                            <TableColumn>Memory</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {data.getProblemStats.bestMemory.map((submission, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell><Link to={`/profile/${submission.username}`}>{submission.username}</Link></TableCell>
                                    <TableCell>{new Date(+submission.date).toDateString()}</TableCell>
                                    <TableCell>{submission.language}</TableCell>
                                    <TableCell>{submission.memory / 1024} MB</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div>
                    <Table>
                        <TableHeader>
                            <TableColumn>Top</TableColumn>
                            <TableColumn>Username</TableColumn>
                            <TableColumn>Date</TableColumn>
                            <TableColumn>Language</TableColumn>
                            <TableColumn>Time Executions</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {data.getProblemStats.timeExecution.map((submission, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell><Link to={`/profile/${submission.username}`}>{submission.username}</Link></TableCell>
                                    <TableCell>{new Date(+submission.date).toDateString()}</TableCell>
                                    <TableCell>{submission.language}</TableCell>
                                    <TableCell>{parseFloat(submission.timeExecutions).toFixed(3)} s</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
