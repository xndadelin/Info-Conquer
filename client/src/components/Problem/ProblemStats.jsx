import { gql, useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import { Loading } from "../Miscellaneous/Loading";
import { Card } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { GET_STATS } from "../../utils/Queries";


export const ProblemStats = () => {
    const { id, problem_name } = useParams();
    const { t } = useTranslation()
    const { loading, data } = useQuery(GET_STATS, {
        variables: {
            id: id || problem_name
        },
    })

    if (loading) return <Loading />
    if (!data || !data.getProblemStats) return <Loading />
    
    Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);


    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#e0e0e0'
                }
            },
            title: {
                display: true,
                text: t('problemStatsPage.solvesOverTimeTitle'),
                color: '#e0e0e0',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Solves',
                    color: '#e0e0e0'
                },
                grid: {
                    color: '#404040'
                },
                ticks: {
                    color: '#e0e0e0'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Date',
                    color: '#e0e0e0'
                },
                grid: {
                    color: '#404040'
                },
                ticks: {
                    color: '#e0e0e0'
                }
            }
        }
    };

    const chartData = {
        labels: data.getProblemStats.solves.slice().reverse().map(obj => new Date(+obj.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Solves',
                data: data.getProblemStats.solves.slice().reverse().map(obj => obj.count),
                borderColor: 'rgba(29, 78, 216, 1)',
                backgroundColor: 'rgba(29, 78, 216, 0.2)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    

    return (
        <main className="container flex-col">
            <h1 className="text-3xl font-bold mb-5 mt-5 text-center">{t('problemStatsPage.insightsTitle')}</h1>

            <section className="bg-[#282828] rounded-lg shadow-md p-6 text-white mt-5 mx-auto">
                <div className="bg-[#181818] p-5 rounded-lg">
                    <Line data={chartData} options={options} />
                </div>
            </section>

            <h1 className="text-3xl font-bold mt-5 text-center">{t('problemStatsPage.firstSubmissionsTitle')}</h1>
            <section className="grid grid-cols-3 max-md:grid-cols-1 gap-5 mt-5">
                <Card className="p-7 bg-gray-700">
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
                <Card className="p-7 bg-gray-700">
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
                <Card className="p-7 bg-gray-700">
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
            </section>
            <section className="grid grid-cols-2 mt-5 max-md:grid-cols-1 gap-3">
                <div>
                    <h1 className="text-3xl font-bold mt-5 mb-5">{t('problemStatsPage.bestMemoryTitle')}</h1>
                    <table className="w-full text-sm text-gray-300 border-collapse shadow-2xl rounded-tr">
                        <thead className="bg-gray-600">
                            <tr>
                                <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('problemStatsPage.tableHeaders.top')}</th>
                                <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('problemStatsPage.tableHeaders.username')}</th>
                                <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('problemStatsPage.tableHeaders.date')}</th>
                                <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('problemStatsPage.tableHeaders.language')}</th>
                                <th className="px-6 py-3 text-left font-medium uppercase tracking-wider"> {t('problemStatsPage.tableHeaders.memory')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-900 divide-y divide-gray-700">
                            {data.getProblemStats.bestMemory.map((submission, index) => (
                                <tr className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}>
                                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><Link to={`/profile/${submission.username}`}>{submission.username}</Link></td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(+submission.date).toDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{submission.language}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{submission.memory} KB</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div>
                    <h1 className="text-3xl font-bold mt-5 mb-5">{t('problemStatsPage.timeExecutionsTitle')}</h1>
                    <table className="w-full text-sm text-gray-300 border-collapse shadow-2xl rounded-tr">
                        <thead className="bg-gray-600">
                            <tr>
                                <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('problemStatsPage.tableHeaders.top')}</th>
                                <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('problemStatsPage.tableHeaders.username')}</th>
                                <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('problemStatsPage.tableHeaders.date')}</th>
                                <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('problemStatsPage.tableHeaders.language')}</th>
                                <th className="px-6 py-3 text-left font-medium uppercase tracking-wider"> {t('problemStatsPage.tableHeaders.timeExecutions')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-900 divide-y divide-gray-700">
                            {data.getProblemStats.timeExecution.map((submission, index) => (
                                <tr className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}>
                                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><Link to={`/profile/${submission.username}`}>{submission.username}</Link></td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(+submission.date).toDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{submission.language}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{parseFloat(submission.timeExecutions).toFixed(4)} ms</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    )
}
