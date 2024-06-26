import { gql, useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import { Loading } from "./Loading";
import { Card, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

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
    const { id, problem_name } = useParams();
    const { t } = useTranslation()
    const { loading, data } = useQuery(getStats, {
        variables: {
            id: id || problem_name
        },
    })

    if (loading) return <Loading />
    if (!data || !data.getProblemStats) return <Loading />
    
    Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

    const options = {
        type: 'line',
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom'
            },
        },
    };

    let chartData = {
        labels: data.getProblemStats.solves.slice().reverse().map(obj => new Date(+obj.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Solves',
                data: data.getProblemStats.solves.slice().reverse().map(obj => obj.count),
                borderColor: 'rgba(224, 67, 67, 0.8)',
                backgroundColor: 'rgba(224, 67, 67, 0.2)',
                fill: true
            }
        ]
    };
    

    return (
        <div className="container flex-col">
            <h1 className="text-3xl font-bold mb-5 mt-5">{t('problemStatsPage.insightsTitle')}</h1>
            <div className="mt-5 max-w-[50%] mx-auto">
                <Line data={chartData} options={options} />
            </div>
            <h1 className="text-3xl font-bold mt-5">{t('problemStatsPage.firstSubmissionsTitle')}</h1>
            <div className="grid grid-cols-3 max-md:grid-cols-1 gap-5 mt-5">
                <Card className="p-7">
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width={100} fill="yellow" height={100} viewBox="0 0 576 512">
                            <path d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z" />
                        </svg>
                        {data.getProblemStats.firstSubmissions[0] && data.getProblemStats.firstSubmissions[0]._id ? (
                            <Link className="font-extrabold" to={`/profile/${data.getProblemStats.firstSubmissions[0]._id}`}>
                                {data.getProblemStats.firstSubmissions[0]._id}
                            </Link>
                        ) : (
                            t('problemStatsPage.noSolvesMessage')
                        )}
                    </div>
                </Card>
                <Card className="p-7">
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width={100} fill="grey" height={100} viewBox="0 0 576 512">
                            <path d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z" />
                        </svg>
                        {data.getProblemStats.firstSubmissions[1] && data.getProblemStats.firstSubmissions[1]._id ? (
                            <Link className="font-extrabold" to={`/profile/${data.getProblemStats.firstSubmissions[1]._id}`}>
                                {data.getProblemStats.firstSubmissions[1]._id}
                            </Link>
                        ) : (
                            t('problemStatsPage.secondSolveMessage')
                        )}
                    </div>
                </Card>
                <Card className="p-7">
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width={100} fill="#8b4b3e" height={100} viewBox="0 0 576 512">
                            <path d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z" />
                        </svg>
                        {data.getProblemStats.firstSubmissions[2] && data.getProblemStats.firstSubmissions[2]._id ? (
                            <Link className="font-extrabold" to={`/profile/${data.getProblemStats.firstSubmissions[2]._id}`}>
                                {data.getProblemStats.firstSubmissions[2]._id}
                            </Link>
                        ) : (
                            t('problemStatsPage.thirdSolveMessage')
                        )}
                    </div>
                </Card>
            </div>
            <div className="grid grid-cols-2 mt-5 max-md:grid-cols-1 gap-3">
                <div>
                    <h1 className="text-3xl font-bold mt-5 mb-5">{t('problemStatsPage.bestMemoryTitle')}</h1>
                    <Table>
                        <TableHeader>
                            <TableColumn>{t('problemStatsPage.tableHeaders.top')}</TableColumn>
                            <TableColumn>{t('problemStatsPage.tableHeaders.username')}</TableColumn>
                            <TableColumn>{t('problemStatsPage.tableHeaders.date')}</TableColumn>
                            <TableColumn>{t('problemStatsPage.tableHeaders.language')}</TableColumn>
                            <TableColumn>{t('problemStatsPage.tableHeaders.memory')}</TableColumn>
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
                    <h1 className="text-3xl font-bold mt-5 mb-5">{t('problemStatsPage.timeExecutionsTitle')}</h1>
                    <Table>
                        <TableHeader>
                            <TableColumn>{t('problemStatsPage.tableHeaders.top')}</TableColumn>
                            <TableColumn>{t('problemStatsPage.tableHeaders.username')}</TableColumn>
                            <TableColumn>{t('problemStatsPage.tableHeaders.date')}</TableColumn>
                            <TableColumn>{t('problemStatsPage.tableHeaders.language')}</TableColumn>
                            <TableColumn>{t('problemStatsPage.tableHeaders.timeExecutions')}</TableColumn>
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
