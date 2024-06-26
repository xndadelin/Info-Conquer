import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Loading } from "../components/Loading";
import { useState } from "react";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Pagination, Card, CardHeader, Link } from "@nextui-org/react";
import { NotFound } from "../pages/NotFound";
import { Error } from "../components/Error";
import { useTranslation } from 'react-i18next';

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
`;

export const Contest = () => {
    const { id } = useParams();
    const [page, setPage] = useState(1);
    const [error, setError] = useState('');
    const participantsPerPage = 20;
    const { data, loading } = useQuery(getContest, {
        variables: { id },
        onCompleted: (data) => {
            console.log(data);
        },
        onError: (error) => {
            setError(error.message);
        }
    });
    const { t } = useTranslation();

    if (loading) return <Loading />;
    if (!data) return <NotFound />;
    if (error) return <Error error={error} />;

    return (
        <div className="container mx-auto p-3 my-5 h-screen">
            <p className="text-4xl font-bold">{data.getContest.name}</p>
            <p className="text-gray-400">{t('contest.createdBy')} {data.getContest.createdBy}</p>
            <p className="text-gray-400 font-bold">{t('contest.startDate')}: {new Date(data.getContest.startDate).toLocaleString()}</p>
            <p className="text-gray-400 font-bold">{t('contest.endDate')}: {new Date(data.getContest.endDate).toLocaleString()} </p>
            <p className="text-gray-400">{t('contest.languages')}: {data.getContest.languages.join(", ")}</p>
            <p className="text-gray-400">{t('contest.description')}: {data.getContest.description}</p>
            <p className="text-gray-400">{t('contest.problems')}: {data.getContest.problems.length}</p>
            <p className="text-gray-400">{t('contest.participants')}: {data.getContest.participants.length}</p>
            <p className="text-gray-400">{t('contest.hasStarted')}: {data.getContest.started ? t('contest.yes') : t('contest.no')}</p>
            <p className="text-gray-400">{t('contest.hasEnded')}: {data.getContest.ended ? t('contest.yes') : t('contest.no')}</p>
            <p className="text-2xl font-bold mt-5">{t('contest.leaderboard')}</p>
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
                    <TableColumn>{t('contest.rank')}</TableColumn>
                    <TableColumn>{t('contest.username')}</TableColumn>
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
                    <p className="text-2xl font-bold mt-5">{t('contest.problems')}</p>
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
            ) :
                <div className="text-3xl font-bold">
                    {t('contest.noProblemsYet')}
                </div>
            }
        </div>
    )
}
