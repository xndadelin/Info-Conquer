import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Loading } from "../../components/Miscellaneous/Loading";
import { useState } from "react";
import { Button, Chip } from "@nextui-org/react";
import { NotFound } from "../../components/Miscellaneous/NotFound";
import { Error } from "../../components/Miscellaneous/Error";
import { useTranslation } from 'react-i18next';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend, BarElement } from 'chart.js';
import { GET_CONTEST } from "../../utils/Queries";
import { Link } from "react-router-dom";

const getColor = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-green-400';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 60) return 'bg-yellow-400';
    if (score >= 50) return 'bg-yellow-300';
    if (score >= 40) return 'bg-orange-500';
    if (score >= 30) return 'bg-orange-400';
    if (score >= 20) return 'bg-orange-300';
    if (score >= 10) return 'bg-red-400';
    return 'bg-red-500';
};

const getTotalColor = (score, maxscore) => {
    const percentage = (score / maxscore) * 100;

    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 80) return 'bg-green-400';
    if (percentage >= 70) return 'bg-yellow-500';
    if (percentage >= 60) return 'bg-yellow-400';
    if (percentage >= 50) return 'bg-yellow-300';
    if (percentage >= 40) return 'bg-orange-500';
    if (percentage >= 30) return 'bg-orange-400';
    if (percentage >= 20) return 'bg-orange-300';
    if (percentage >= 10) return 'bg-red-400';
    return 'bg-red-500';
};

export const Contest = () => {
    const { id } = useParams();
    const [page, setPage] = useState(1);
    const [error, setError] = useState('');
    const participantsPerPage = 20;
    const { data, loading } = useQuery(GET_CONTEST, {
        variables: { id },
        onError: (error) => {
            setError(error.message);
        }
    });
    const { t } = useTranslation();

    if (loading) return <Loading />;
    if (!data || !data.getContest) return <NotFound />;
    if (error) return <Error error={error} />;

    Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend, BarElement);

    const barConfig = {
        options: {
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Solved Percentage',
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
                    ticks: { color: '#e0e0e0' },
                    grid: { color: '#404040' }
                },
                x: {
                    ticks: { color: '#e0e0e0' },
                    grid: { color: '#404040' }
                }
            }
        }
    }



    const barData = {
        labels: data.getContest.problems.map(problem => problem.id),
        datasets: [{
            label: 'Solved Percentage',
            data: data.getContest.problems.map(problem => {
                const solvedCount = data.getContest.participants.filter(participant =>
                    participant.problems.find(p => p.id === problem.id && p.score > 0)
                ).length;
                return (solvedCount / data.getContest.participants.length) * 100;
            }),
            backgroundColor: 'rgba(29, 78, 216, 0.2)',
            borderColor: 'rgba(29, 78, 216, 0.2)',
            borderWidth: 1
        }]
    };

    const InfoItem = ({label, value }) => (
        <div className="space-x-2 text-gray-300">
            <span className="font-semibold">{label}:</span>
            <span>{value}</span>
        </div>
    );


    const problemsExists = data.getContest.problems.every(problem => problem.id !== null);

    return (
        <main className="container mx-auto p-5 my-5 bg-gray-900 text-white">
            <section className="bg-gray-800 rounded-lg shadow-lg p-8 mb-10 transition-all duration-300 hover:shadow-xl">
                <h1 className="text-4xl font-bold mb-6 text-blue-400">{data.getContest.name}</h1>
                <div>
                    <InfoItem label={t('contest.createdBy')} value={data.getContest.createdBy} />
                    <InfoItem label={t('contest.startDate')} value={new Date(data.getContest.startDate).toLocaleString()} />
                    <InfoItem label={t('contest.endDate')} value={new Date(data.getContest.endDate).toLocaleString()} />
                    <InfoItem label="Duration" value={`${(Math.abs(new Date(data.getContest.endDate) - new Date(data.getContest.startDate)) / (1000 * 60 * 60)).toFixed(2)} hours`} />
                    <InfoItem label={t('contest.languages')} value={data.getContest.languages.join(", ")} />
                    <InfoItem label={t('contest.description')} value={data.getContest.description} />
                    <InfoItem label={t('contest.problems')} value={data.getContest.problems.length ? data.getContest.problems.map(problem => problem.id).join(", ") : 'Soon'} />
                    <InfoItem label={t('contest.participants')} value={data.getContest.participants.length} />
                    <InfoItem label={t('contest.hasStarted')} value={data.getContest.started ? t('contest.yes') : t('contest.no')} />
                    <InfoItem label={t('contest.hasEnded')} value={data.getContest.ended ? t('contest.yes') : t('contest.no')} />
                </div>
            </section>

            <section className="bg-gray-800 rounded-lg shadow-lg p-6 mb-10 transition-all duration-300 hover:shadow-xl">
                <h2 className="text-3xl font-bold mb-6 text-blue-400">{t('contest.leaderboard')}</h2>
                <div className="overflow-x-auto shadow-2xl rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-gray-700 sticky top-0">
                            <tr>
                                <th className="px-6 py-4" scope="col">Rank</th>
                                <th className="px-6 py-4" scope="col">Username</th>
                                {data?.getContest?.problems.map((problem, index) => (
                                    <th className="px-6 py-4" key={index} scope="col">{problem.id}</th>
                                ))}
                                {data?.getContest?.problems.length > 0 && (
                                    <th className="px-6 py-4" scope="col">Total</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {data.getContest.participants
                                .slice((page - 1) * participantsPerPage, page * participantsPerPage)
                                .map((participant, index) => (
                                    <tr className={`border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}`} key={index}>
                                        <td className="px-6 py-4">{index + 1 + (page - 1) * participantsPerPage}</td>
                                        <td className="px-6 py-4">
                                            <Link className="text-blue-400 hover:underline" to={`/profile/${participant.username}`}>
                                                {participant.username}
                                            </Link>
                                        </td>
                                        {data.getContest.problems.map((problem, problemIndex) => {
                                            const score = participant.problems.find(p => p.id === problem.id)?.score || 0;
                                            return (
                                                <td key={problemIndex} className={`px-6 py-4 ${getColor(score)}`}>{score}</td>
                                            );
                                        })}
                                        {data?.getContest?.problems.length > 0 && (
                                            <td className={`px-6 py-4 ${getTotalColor(participant.problems.reduce((a, b) => a + b.score, 0), 100 * data.getContest.problems.length)}`}>
                                                {participant.problems.reduce((a, b) => a + b.score, 0)}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between mt-5">
                    <Button isDisabled={page === 1} color="primary" variant="flat" onClick={() => setPage(page - 1)}>Previous</Button>
                    <Button isDisabled={data.getContest.participants.length <= page * participantsPerPage} color="primary" variant="flat" onClick={() => setPage(page + 1)}>Next</Button>
                </div>
            </section>

            {((data.getContest.started || data.getContest.ended) && problemsExists) ? (
                <>
                    <section className="bg-gray-800 rounded-lg shadow-lg p-6 mb-10 transition-all duration-300 hover:shadow-xl">
                        <h2 className="text-3xl font-bold mb-6 text-blue-400">{t('contest.problems')}</h2>
                        <div className="overflow-x-auto shadow-2xl bg-gray-700 rounded-lg">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase sticky top-0 bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-4" scope="col">Index</th>
                                        <th className="px-6 py-4" scope="col">Problems</th>
                                        <th className="px-6 py-4" scope="col">Category</th>
                                        <th className="px-6 py-4" scope="col">Subcategories</th>
                                        <th className="px-6 py-4" scope="col">Difficulty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.getContest.problems.map((problem, index) => (
                                        <tr className={`border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}`} key={index}>
                                            <td className="px-6 py-4">{index + 1}</td>
                                            <td className="px-6 py-4">
                                                <Link className="text-blue-400 hover:underline" to={`/contests/${id}/${problem.id}`}>
                                                    {problem.id}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">{problem.category}</td>
                                            <td className="px-6 py-4 flex gap-1 flex-wrap">
                                                {problem.subcategories.map((subcategory, subIndex) => (
                                                    <Chip key={subIndex} color="primary" className="mr-2">{subcategory}</Chip>
                                                ))}
                                            </td>
                                            <td className="px-6 py-4">{problem.difficulty}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                    <section className="bg-gray-800 rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                        <h2 className="text-3xl font-bold mb-6 text-blue-400">{t('contests.solvedPercentage')}</h2>
                        <div className="bg-gray-900 p-5 rounded-lg">
                            <Bar data={barData} options={barConfig.options} />
                        </div>
                    </section>
                </>
            ) : (
                <section className="text-3xl font-bold text-center py-10">
                    You have to be a participant to see the problems and the solved percentage.
                </section>
            )}
        </main>
    );
};
