import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Loading } from "../components/Loading";
import { useState } from "react";
import { Chip, Link } from "@nextui-org/react";
import { NotFound } from "../pages/NotFound";
import { Error } from "../components/Error";
import { useTranslation } from 'react-i18next';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend, BarElement } from 'chart.js';

const getContest = gql`
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
    const { data, loading } = useQuery(getContest, {
        variables: { id },
        onError: (error) => {
            setError(error.message);
        }
    });
    const { t } = useTranslation();

    if (loading) return <Loading />;
    if (!data) return <NotFound />;
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
        <div className="container mx-auto p-3 my-5">
            <div className="bg-[#202020] rounded-lg shadow-md p-6 text-white">
                <h1 className="text-4xl font-bold mb-4">{data.getContest.name}</h1>
                <p className="text-gray-400 mb-2">{t('contest.createdBy')}: {data.getContest.createdBy}</p>
                <p className="text-gray-400 mb-2">{t('contest.startDate')}: {new Date(data.getContest.startDate).toLocaleString()}</p>
                <p className="text-gray-400 mb-2">{t('contest.endDate')}: {new Date(data.getContest.endDate).toLocaleString()}</p>
                <p className="text-gray-400 mb-2">Duration: {(Math.abs(new Date(data.getContest.endDate) - new Date(data.getContest.startDate)) / (1000 * 60 * 60)).toFixed(2)}  hours</p>
                <p className="text-gray-400 mb-2">{t('contest.languages')}: {data.getContest.languages.join(", ")}</p>
                <p className="text-gray-400 mb-2">{t('contest.description')}: {data.getContest.description}</p>
                <p className="text-gray-400 mb-2">{t('contest.problems')}: {data.getContest.problems.length}</p>
                <p className="text-gray-400 mb-2">{t('contest.participants')}: {data.getContest.participants.length}</p>
                <p className="text-gray-400 mb-2">{t('contest.hasStarted')}: {data.getContest.started ? t('contest.yes') : t('contest.no')}</p>
                <p className="text-gray-400">{t('contest.hasEnded')}: {data.getContest.ended ? t('contest.yes') : t('contest.no')}</p>
            </div>
            <p className="text-2xl font-bold mt-5">{t('contest.leaderboard')}</p>
            <div className="overflow-x-auto rounded-lg shadow-lg mt-3">
                <table className="min-w-full bg-[#181818] text-white">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 border-b border-gray-700 text-left text-sm font-medium text-gray-400">Rank</th>
                            <th className="px-6 py-3 border-b border-gray-700 text-left text-sm font-medium text-gray-400">Username</th>
                            {data.getContest.problems.map(problem => (
                                <th className="px-6 py-3 border-b border-gray-700 text-left text-sm font-medium text-gray-400">{problem.id}</th>
                            ))}
                            <th className="px-6 py-3 border-b border-gray-700 text-left text-sm font-medium text-gray-400">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.getContest.participants
                            .slice((page - 1) * participantsPerPage, page * participantsPerPage)
                            .map((participant, index) => (
                                <tr className="border-b border-gray-700 hover:bg-gray-700">
                                    <td className="px-6 py-4 text-left text-sm">{index + 1}</td>
                                    <td className="px-6 py-4 text-left text-sm">
                                        <Link className="text-white" href={`/${participant.username}`}>
                                            {participant.username}
                                        </Link>
                                    </td>
                                    {data.getContest.problems.map((problem) => {
                                        const score = participant.problems.find(p => p.id === problem.id)?.score || 0;
                                        return (
                                            <td className={`px-6 py-4 text-left text-sm ${getColor(score)}`}>{score}</td>
                                        );
                                    })}
                                    <td className={`px-6 py-4 text-left text-sm ${getTotalColor(participant.problems.reduce((a, b) => a + b.score, 0), 100 * data.getContest.problems.length)}`}>
                                        {participant.problems.reduce((a, b) => a + b.score, 0)}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            {data.getContest.started || data.getContest.ended ? (
                <>
                    <p className="text-2xl font-bold mt-10">{t('contest.problems')}</p>
                    <div className="overflow-x-auto rounded-lg shadow-lg mt-3">
                        <table className="min-w-full bg-[#181818] text-white">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 border-b border-gray-700 text-left text-sm font-medium text-gray-400">Index</th>
                                    <th className="px-6 py-3 border-b border-gray-700 text-left text-sm font-medium text-gray-400">Problems</th>
                                    <th className="px-6 py-3 border-b border-gray-700 text-left text-sm font-medium text-gray-400">Category</th>
                                    <th className="px-6 py-3 border-b border-gray-700 text-left text-sm font-medium text-gray-400">Subcategories</th>
                                    <th className="px-6 py-3 border-b border-gray-700 text-left text-sm font-medium text-gray-400">Difficulty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.getContest.problems.map((problem, index) => (
                                    <tr className="border-b border-gray-700 hover:bg-gray-700">
                                        <td className="px-6 py-4 text-left text-sm">{index + 1}</td>
                                        <td className="px-6 py-4 text-left text-sm">
                                            <Link className="text-white" href={`/contests/${id}/${problem.id}`}>
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
                        <div className="mt-10">
                            <p className="text-2xl font-bold">{t('contests.solvedPercentage')}</p>
                            <Bar data={barData} options={barConfig.options} />
                        </div>
                    </div>
                </>
            ) :
                <div className="text-3xl font-bold">
                    {t('contest.noProblemsYet')}
                </div>
            }
        </div>
    )
}
