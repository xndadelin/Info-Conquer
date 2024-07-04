import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Loading } from "../components/Loading";
import { useState } from "react";
import { Button, Chip, Link } from "@nextui-org/react";
import { NotFound } from "../pages/NotFound";
import { Error } from "../components/Error";
import { useTranslation } from 'react-i18next';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend, BarElement } from 'chart.js';

const GET_CONTEST = gql`
    query GetContest($id: String) {
        getContest(id: $id) {
            description
            endDate
            languages
            name
            startDate
            createdBy
            problems {
                id
                category
                difficulty
                subcategories
            }
            participants {
                username
                score
                problems {
                    id
                    score
                }
            }
            started 
            ended
        }
    }
`;

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
        type: 'bar',
        options: {
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Solved Percentage',
                },
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
            backgroundColor: 'rgba(224, 67, 67, 0.8)',
            borderColor: 'rgba(224, 67, 67, 0.2)',
            borderWidth: 1
        }]
    };

    return (
        <div className="container mx-auto p-5 my-5">
            <div className="bg-[#1f1f1f] rounded-lg shadow-md p-8 text-white mb-10">
                <h1 className="text-4xl font-bold mb-4">{data.getContest.name}</h1>
                <div className="grid gap-1">
                    <p className="text-gray-400"><strong>{t('contest.createdBy')}:</strong> {data.getContest.createdBy}</p>
                    <p className="text-gray-400"><strong>{t('contest.startDate')}:</strong> {new Date(data.getContest.startDate).toLocaleString()}</p>
                    <p className="text-gray-400"><strong>{t('contest.endDate')}:</strong> {new Date(data.getContest.endDate).toLocaleString()}</p>
                    <p className="text-gray-400"><strong>Duration:</strong> {(Math.abs(new Date(data.getContest.endDate) - new Date(data.getContest.startDate)) / (1000 * 60 * 60)).toFixed(2)} hours</p>
                    <p className="text-gray-400"><strong>{t('contest.languages')}:</strong> {data.getContest.languages.join(", ")}</p>
                    <p className="text-gray-400"><strong>{t('contest.description')}:</strong> {data.getContest.description}</p>
                    <p className="text-gray-400"><strong>{t('contest.problems')}:</strong> {data.getContest.problems.length ? data.getContest.problems.map(problem => problem.id).join(", ") : 'Soon'}</p>
                    <p className="text-gray-400"><strong>{t('contest.participants')}:</strong> {data.getContest.participants.length}</p>
                    <p className="text-gray-400"><strong>{t('contest.hasStarted')}:</strong> {data.getContest.started ? t('contest.yes') : t('contest.no')}</p>
                    <p className="text-gray-400"><strong>{t('contest.hasEnded')}:</strong> {data.getContest.ended ? t('contest.yes') : t('contest.no')}</p>
                </div>
            </div>
            <div className="bg-[#282828] rounded-lg shadow-md p-6 text-white mb-10">
                <h2 className="text-2xl font-bold mb-5">{t('contest.leaderboard')}</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-[#181818] text-white rounded-lg">
                        <thead className="bg-[#222] text-gray-400">
                            <tr>
                                <th className="px-6 py-3 border-b border-gray-700 text-left text-sm font-medium">Rank</th>
                                <th className="px-6 py-3 border-b border-gray-700 text-left text-sm font-medium">Username</th>
                                {data.getContest.problems.map((problem, index) => (
                                    <th className="px-6 py-3 border-b border-gray-700 text-left text-sm font-medium">{problem.id}</th>
                                ))}
                                {data?.getContest?.problems.length > 0 && (
                                    <th className="px-6 py-3 border-b border-gray-700 text-left text-sm font-medium">Total</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {data.getContest.participants
                                .slice((page - 1) * participantsPerPage, page * participantsPerPage)
                                .map((participant, index) => (
                                    <tr className="border-b border-gray-700 hover:bg-gray-700">
                                        <td className="px-6 py-4 text-left text-sm">{index + 1 + (page - 1) * participantsPerPage}</td>
                                        <td className="px-6 py-4 text-left text-sm">
                                            <Link className="text-white hover:underline" href={`/${participant.username}`}>
                                                {participant.username}
                                            </Link>
                                        </td>
                                        {data.getContest.problems.map((problem) => {
                                            const score = participant.problems.find(p => p.id === problem.id)?.score || 0;
                                            return (
                                                <td className={`px-6 py-4 text-left text-sm ${getColor(score)}`}>{score}</td>
                                            );
                                        })}
                                        {data?.getContest?.problems.length > 0 && (
                                            <td className={`px-6 py-4 text-left text-sm ${getTotalColor(participant.problems.reduce((a, b) => a + b.score, 0), 100 * data.getContest.problems.length)}`}>
                                                {participant.problems.reduce((a, b) => a + b.score, 0)}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between mt-5">
                    <Button isDisabled={page === 1} color="danger" variant="faded" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
                    <Button isDisabled={data.getContest.participants.length <= page * participantsPerPage} color="danger" variant="faded" disabled={data.getContest.participants.length <= page * participantsPerPage} onClick={() => setPage(page + 1)}>Next</Button>
                </div>
            </div>
            {(data.getContest.started || data.getContest.ended) ? (
                <>
                    <div className="bg-[#282828] rounded-lg shadow-md p-6 text-white mb-10">
                        <h2 className="text-2xl font-bold mb-5">{t('contest.problems')}</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-[#181818] text-white rounded-lg">
                                <thead className="bg-[#222] text-gray-400">
                                    <tr>
                                        <th className="px-6 py-3 border-b border-gray-700 text-left text-sm font-medium">Index</th>
                                        <th className="px-6 py-3 border-b border-gray-700 text-left text-sm font-medium">Problems</th>
                                        <th className="px-6 py-3 border-b border-gray-700 text-left text-sm font-medium">Category</th>
                                        <th className="px-6 py-3 border-b border-gray-700 text-left text-sm font-medium">Subcategories</th>
                                        <th className="px-6 py-3 border-b border-gray-700 text-left text-sm font-medium">Difficulty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.getContest.problems.map((problem, index) => (
                                        <tr className="border-b border-gray-700 hover:bg-gray-700">
                                            <td className="px-6 py-4 text-left text-sm">{index + 1}</td>
                                            <td className="px-6 py-4 text-left text-sm">
                                                <Link className="text-white hover:underline" href={`/contests/${id}/${problem.id}`}>
                                                    {problem.id}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-left text-sm">{problem.category}</td>
                                            <td className="px-6 py-4 text-left text-sm flex gap-1">
                                                {problem.subcategories.map((subcategory) => (
                                                    <Chip color="danger" className="mr-2">{subcategory}</Chip>
                                                ))}
                                            </td>
                                            <td className="px-6 py-4 text-left text-sm">{problem.difficulty}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="bg-[#282828] rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-5">{t('contests.solvedPercentage')}</h2>
                        <div className="bg-[#181818] p-5 rounded-lg">
                            <Bar data={barData} options={barConfig.options} />
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-3xl font-bold text-white">
                    {t('contest.noProblemsYet')}
                </div>
            )}
        </div>
    );
};
