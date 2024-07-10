import { gql, useQuery, useMutation } from "@apollo/client";
import { Loading } from '../components/Loading';
import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { NotFound } from "../components/NotFound";
import { useTranslation } from "react-i18next";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { GET_CONTESTS, JOIN_CONTEST } from "../utils/Queries";
import { motion } from "framer-motion";

export const Contests = () => {
    const { data, loading } = useQuery(GET_CONTESTS);
    const [id, setId] = useState('');
    const { t } = useTranslation();
    const { user } = useContext(UserContext);
    const [joinContestMutation] = useMutation(JOIN_CONTEST, {
        onCompleted: (data) => {
            if (data.joinContest.success) {
                window.location.href = `/contests/view/${id}`;
            }
        },
        onError: (error) => {
            console.error("Error joining contest:", error);
        }
    });

    if (loading) return <Loading />;
    if (!data || !data.getContests || data.getContests.length === 0) return <NotFound />;

    const features = t('contests.meta', { returnObjects: true });

    const ongoingContests = data.getContests.filter(contest => contest.started && !contest.ended);
    const endedContests = data.getContests.filter(contest => contest.ended);
    const upcomingContests = data.getContests.filter(contest => !contest.started);

    const userIsLoggedIn = user && user.getUser ? true : false;
    
    const headers = [t('contests.ongoing'), t('contests.upcoming'), t('contests.ended')]
    return (
        <motion.main 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto mt-20 p-4 h-full"
        >
            <section className="flex flex-col gap-5 text-center">
                <div className="text-5xl font-extrabold text-primary-900">🏆 {t('contests.header')}</div>
                <h3 className="text-xl text-gray-400 mt-4">{t('contests.description')}</h3>
            </section>
            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="container flex flex-col gap-10 mt-20"
            >
                {[[...ongoingContests], [...upcomingContests], [...endedContests]].map((contests, index) => (
                    <div>
                        <p className="text-3xl font-extrabold">{headers[index]}</p>
                        <div className="grid grid-cols-3 my-5 gap-5 max-md:grid-cols-2 max-sm:grid-cols-1">
                            {contests.map((contest) => (
                                <Card className="bg-gray-800 transform transition duration-500 ease-in-out hover:scale-105">
                                    <CardHeader className="grid col-span-2">
                                        <Link className="text-3xl font-bold" target="_blank" to={`/contests/view/${contest._id}`}>
                                            {contest.name}
                                        </Link>
                                        <p className="text-gray-400">{`${features.created_by} ${contest.createdBy}`}</p>
                                    </CardHeader>
                                    <CardBody>
                                        <h4 className="text-xl font-bold">{features.description}</h4>
                                        <h4 dangerouslySetInnerHTML={{
                                            __html: `${contest.description.slice(0, 100)}... <a target='_blank' style='color: rgb(51,102,204);' href='/contests/view/${contest._id}'>${features.view_more}</a>`
                                        }}></h4>
                                        <h4 className="text-xl font-bold">{features.start_date}:</h4>
                                        {new Date(contest.startDate).toLocaleString()}
                                        <h4 className="text-xl font-bold">{features.end_date}:</h4>
                                        {new Date(contest.endDate).toLocaleString()}
                                        <div className="flex flex-col">
                                            <h4 className="text-xl font-bold">{features.languages}:</h4>
                                            <ul className="ml-3 list-disc">
                                                {contest.languages.map((language) => (
                                                    <li>{language}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </CardBody>
                                    <CardFooter>
                                        {userIsLoggedIn && (
                                            <Button
                                                isDisabled={contest.hasJoined || index === 0 || index === 2}
                                                onClick={() => {
                                                    joinContestMutation({ variables: { id: contest._id } });
                                                    setId(contest._id);
                                                }}
                                                variant="faded"
                                            >
                                                {contest.hasJoined ? features.joined : index === 0 ? features.ongoing : index === 2 ? features.ended : features.join}
                                            </Button>
                                        )}
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </motion.section>
        </motion.main>
    );
};