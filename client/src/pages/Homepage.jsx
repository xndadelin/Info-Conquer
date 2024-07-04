import { useQuery, gql } from "@apollo/client";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import { Loading } from "../components/Loading";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { Calendar } from "../utils/Calendar";
import { Trophy } from "../utils/Trophy";
import { Article } from "../utils/Article"
import { useTranslation } from "react-i18next";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

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
                borderColor: 'rgba(224, 67, 67, 0.8)',
                backgroundColor: 'rgba(224, 67, 67, 0.2)',
                fill: true
            }
        ]
    };

    return (
        <div className="container px-5 mx-auto my-5 mt-20">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold">{t('homepage.greeting', { username: user.getUser.username })}</h1>
                <p className="text-lg text-gray-600">{t('homepage.welcome')}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card as={Link} href={"/problems"} className="bg-green-500 p-5">
                    <CardHeader className="flex justify-center items-center">
                        <Trophy />
                    </CardHeader>
                    <CardBody>
                        <h2 className="text-2xl font-bold text-center">{t('homepage.solveProblems')}</h2>
                        <p className="text-gray-100 text-center">{t('homepage.conquering')}</p>
                    </CardBody>
                </Card>
                <Card as={Link} href={"/calendar"} className="bg-yellow-400 p-5">
                    <CardHeader className="flex justify-center items-center">
                        <Calendar />
                    </CardHeader>
                    <CardBody>
                        <h2 className="text-2xl font-bold text-center">{t('homepage.dailyProblem')}</h2>
                        <p className="text-gray-100 text-center">{t('homepage.todaysDaily')}</p>
                    </CardBody>
                </Card>
                <Card as={Link} href={"/contests"} className="bg-blue-400 p-5">
                    <CardHeader className="flex justify-center items-center">
                        <Trophy />
                    </CardHeader>
                    <CardBody>
                        <h2 className="text-2xl font-bold text-center">{t('homepage.feelingComp')}</h2>
                        <p className="text-gray-100 text-center">{t('homepage.participateContest')}</p>
                    </CardBody>
                </Card>
                <Card as={Link} href={"/articles/publish"} className="bg-red-500 p-5">
                    <CardHeader className="flex justify-center items-center">
                        <Article />
                    </CardHeader>
                    <CardBody>
                        <h2 className="text-2xl font-bold text-center">{t('homepage.feelingArtsy')}</h2>
                        <p className="text-gray-100 text-center">{t('homepage.publishArticle')}</p>
                    </CardBody>
                </Card>
            </div>

            <div className="mt-12 bg-[#282828] p-5 rounded-lg">
                <h2 className="text-3xl font-bold text-center mb-6">{t('homepage.activityLast7Days')}</h2>
                {infoData && (
                    <div className="bg-[#181818] p-5 rounded-lg"> 
                        <Line data={chartData} options={options} />
                    </div>
                )}
            </div>

            <div className="mt-12">
                <h2 className="text-3xl font-bold text-center mb-6">{t('homepage.newestAnnouncements')}</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {announcementsData.getAnnouncements.map((announcement, index) => (
                        <Card as={Link} href={`/announcement/${encodeURIComponent(announcement.title)}`} key={index}>
                            <CardBody>
                                <h3 className="text-2xl font-bold text-danger">{announcement.title}</h3>
                                <p className="text-gray-400">{t('homepage.announcementBy')}{' '}
                                    <Link href={`/profile/${announcement.createdBy}`} color="danger">
                                        {announcement.createdBy}
                                    </Link>
                                </p>
                                <div className="text-white" dangerouslySetInnerHTML={{ __html: `${announcement.content.slice(0, 500)}... <a class="text-danger" href='/announcement/${encodeURIComponent(announcement.title)}'>${t('homepage.seeMore')}</a>` }}></div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-3xl font-bold text-center mb-6">{t('homepage.topProblems')}</h2>
                <Table isStriped isCompact>
                    <TableHeader>
                        <TableColumn>{t('homepage.title')}</TableColumn>
                        <TableColumn>{t('homepage.difficulty')}</TableColumn>
                        <TableColumn>{t('homepage.successRate')}</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {infoData.getHomepageInfo.topProblems.map((problem, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Link href={`/problems/${problem.title}`} color="danger">{problem.title}</Link>
                                </TableCell>
                                <TableCell>{problem.difficulty}</TableCell>
                                <TableCell>{parseInt(problem.successRate)}%</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
