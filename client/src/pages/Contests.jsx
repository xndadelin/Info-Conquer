import { gql, useQuery, useMutation } from "@apollo/client";
import { Loading } from '../components/Loading';
import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { NotFound } from "./NotFound";
import { useTranslation } from "react-i18next";

const getContests = gql`
    query GetContests {
        getContests {
            _id
            description
            endDate
            languages
            name
            startDate
            createdBy
        }
    }
`;

const joinContest = gql`
    mutation JoinContest($id: String) {
        joinContest(id: $id) {
            success
        }
    }
`;

export const Contests = () => {
    const { data, loading } = useQuery(getContests);
    const [id, setId] = useState('');
    const { user } = useContext(UserContext);
    const { t } = useTranslation();
    const [joinContestMutation] = useMutation(joinContest, {
        onCompleted: (data) => {
            if (data.joinContest.success) {
                window.location.href = `/contests/view/${id}`;
            }
        },
        onError: (error) => {
            console.log(error);
        }
    });

    if (loading) return <Loading />;
    if (!data) return <NotFound />;

    const features = t('contests.meta', { returnObjects: true });

    return (
        <div className="mt-10 p-4 container mx-auto h-screen">
            <div className="flex flex-col gap-5 self-start">
                <div className="text-5xl text-white font-extrabold">🏆 {t('contests.header')}</div>
                <p className="text-2xl text-white">{t('contests.description')}</p>
            </div>
            <div className="container grid grid-cols-3 my-5 mt-10 gap-5 max-md:grid-cols-2 max-sm:grid-cols-1">
                {data.getContests.map((contest) => (
                    <Card key={contest._id}>
                        <CardHeader className="grid col-span-2">
                            <Link className="text-3xl font-bold" target="_blank" to={`/contests/view/${contest._id}`}>
                                {contest.name}
                            </Link>
                            <p className="text-gray-400">{`${features.created_by} ${contest.createdBy}`}</p>
                        </CardHeader>
                        <CardBody>
                            <p className="text-xl font-bold">{features.description}</p>
                            <p dangerouslySetInnerHTML={{
                                __html: `${contest.description.slice(0, 100)}... <a target='_blank' style='color: rgb(51,102,204);' href='/contests/view/${contest._id}'>${features.view_more}</a>`
                            }}></p>
                            <p className="text-xl font-bold">{features.start_date}:</p>
                            {new Date(contest.startDate).toLocaleString()}
                            <p className="text-xl font-bold">{features.end_date}:</p>
                            {new Date(contest.endDate).toLocaleString()}
                            <div className="flex flex-col">
                                <p className="text-xl font-bold">{features.languages}:</p>
                                <ul className="ml-3 list-disc">
                                    {contest.languages.map((language) => (
                                        <li key={language}>{language}</li>
                                    ))}
                                </ul>
                            </div>
                        </CardBody>
                        <CardFooter>
                            <Button
                                onClick={() => {
                                    joinContestMutation({ variables: { id: contest._id } });
                                    setId(contest._id);
                                }}
                                variant="faded"
                            >
                                {features.join}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};
