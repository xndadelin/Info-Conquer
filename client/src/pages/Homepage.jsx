import { useQuery, gql } from "@apollo/client";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import { Loading } from "../components/Loading";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { Calendar } from "../utils/Calendar";
import { Trophy } from "../utils/Trophy";
import { Article } from "../utils/Article"
import { useTranslation } from "react-i18next";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { motion } from "framer-motion";


export const Homepage = () => {
    const { t } = useTranslation();
    const { user } = useContext(UserContext);

    const { loading: loadingAnnouncements, data: announcementsData } = useQuery(gql`
        query getAnnouncements {
            getAnnouncements {
                title
                content
                createdBy
            }
        }
    `);

    const { loading: loadingInfo, data: infoData } = useQuery(gql`
        query getHomepageInfo {
            getHomepageInfo {
                topProblems {
                    title
                    difficulty
                    successRate
                }
                lastSeven {
                    date
                    count
                }
            }
        }
    `);

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

    if (loadingAnnouncements || loadingInfo) return <Loading />;
    
    let chartData = {
        labels: infoData.getHomepageInfo.lastSeven.slice().reverse().map(obj => new Date(+obj.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Submissions',
                data: infoData.getHomepageInfo.lastSeven.slice().reverse().map(obj => obj.count),
                borderColor: 'rgba(20, 24, 39, 0.8)',
                backgroundColor: 'rgba(20, 24, 39, 0.8)',
                fill: true
            }
        ]
    };


    return (
        <div className="container px-5 mx-auto my-5 mt-20">
            <motion.div 
                className="text-center mb-10 bg-gradient-to-r from-gray-900 to-gray-800 p-10 rounded-lg shadow-xl"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-5xl font-bold mb-4 text-primary-500">{t('homepage.greeting', { username: user.getUser.username })}</h1>
                <motion.p 
                    className="text-xl text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    {t('homepage.welcome')}
                </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: 'solveProblems', subtitle: 'conquering', icon: Trophy, color: 'green', link: '/problems' },
                    { title: 'dailyProblem', subtitle: 'todaysDaily', icon: Calendar, color: 'yellow', link: '/calendar' },
                    { title: 'feelingComp', subtitle: 'participateContest', icon: Trophy, color: 'blue', link: '/contests' },
                    { title: 'feelingArtsy', subtitle: 'publishArticle', icon: Article, color: 'red', link: '/articles/publish' },
                ].map((item) => (
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Card as={Link} href={item.link} className={`bg-${item.color}-500 p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl`}>
                            <CardHeader className="flex justify-center items-center">
                                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                                    <item.icon className="w-16 h-16" />
                                </motion.div>
                            </CardHeader>
                            <CardBody>
                                <h2 className="text-2xl font-bold text-center mb-2">{t(`homepage.${item.title}`)}</h2>
                                <p className="text-gray-100 text-center">{t(`homepage.${item.subtitle}`)}</p>
                            </CardBody>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <motion.div 
                className="mt-16 bg-gray-800 p-8 rounded-lg shadow-xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold text-center mb-8 text-primary-500">{t('homepage.activityLast7Days')}</h2>
                {infoData && (
                    <div className="bg-[#181818] p-6 rounded-lg shadow-inner"> 
                        <Line data={chartData} options={{
                            ...options,
                            animation: {
                                duration: 2000,
                                easing: 'easeOutQuart'
                            },
                            scales: {
                                y: {
                                    grid: {
                                        color: 'rgba(255, 255, 255, 0.1)',
                                    }
                                },
                                x: {
                                    grid: {
                                        color: 'rgba(255, 255, 255, 0.1)',
                                    }
                                }
                            }
                        }} />
                    </div>
                )}
            </motion.div>

            <div className="mt-16">
                <h2 className="text-3xl font-bold text-center mb-8 text-primary-500">{t('homepage.newestAnnouncements')}</h2>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {announcementsData.getAnnouncements.map((announcement, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Card className="bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300" as={Link} href={`/announcement/${encodeURIComponent(announcement.title)}`}>
                                <CardBody className="p-6">
                                    <h3 className="text-2xl font-bold text-primary-500 mb-2">{announcement.title}</h3>
                                    <p className="text-gray-400 mb-4">{t('homepage.announcementBy')}{' '}
                                        <Link href={`/profile/${announcement.createdBy}`} color="primary">
                                            {announcement.createdBy}
                                        </Link>
                                    </p>
                                    <div className="text-white" dangerouslySetInnerHTML={{ __html: `${announcement.content.slice(0, 500)}... <a class="text-primary-500 hover:underline" href='/announcement/${encodeURIComponent(announcement.title)}'>${t('homepage.seeMore')}</a>` }}></div>
                                </CardBody>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            <motion.div 
                className="mt-16 rounded-3xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold text-center mb-8 text-primary-500">{t('homepage.topProblems')}</h2>
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs uppercase bg-gray-700 text-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-4">{t('homepage.title')}</th>
                            <th scope="col" className="px-6 py-4">{t('homepage.difficulty')}</th>
                            <th scope="col" className="px-6 py-4">{t('homepage.successRate')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {infoData.getHomepageInfo.topProblems.map((problem, index) => (
                        <motion.tr 
                            key={index}
                            className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'} hover:bg-gray-700 transition-colors`}
                            whileHover={{ scale: 1.02 }}
                        >
                            <td className="px-6 py-4 font-medium">
                                <Link href={`/problem/${encodeURIComponent(problem.title)}`} color="primary" className="hover:underline">
                                    {problem.title}
                                </Link>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getDifficultyColor(problem.difficulty)}`}></span>
                                {problem.difficulty}
                            </td>
                            <td className="px-6 py-4">{parseInt(problem.successRate)}%</td>
                        </motion.tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
        </div>
    );
};

function getDifficultyColor(difficulty) {
    switch(difficulty.toLowerCase()) {
        case 'easy': return 'bg-green-500';
        case 'medium': return 'bg-yellow-500';
        case 'hard': return 'bg-red-500';
        default: return 'bg-gray-500';
    }
}
