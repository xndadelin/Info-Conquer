import {useQuery, gql} from "@apollo/client";
import {Card, CardBody, CardHeader} from "@nextui-org/react";
import {Link} from "@nextui-org/react";
import { Loading } from "../components/Loading";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { Calendar } from "../utils/Calendar";
import { Trophy } from "../utils/Trophy";
import { Article } from "../utils/Article"
import {Chart} from 'react-google-charts'
const newAnnouncements = gql`
    query getAnnouncements {
        getAnnouncements {
                title
                content
                createdBy
        }
    }
`
const getInfos = gql`
query getHomepageInfo {
    getHomepageInfo {
      topProblems {
        title
        difficulty
        successRate
        tags
      }
      lastSeven{
        date
        count
      }
    }
  }
`
export const Homepage = () => {
    const getAnnouncements = useQuery(newAnnouncements)
    const getInfo = useQuery(getInfos)
    const {user} = useContext(UserContext)
    if(getAnnouncements.loading) return <Loading/>
    if(getInfos.loading) return <Loading/>
    return (
       <div className="container flex flex-col px-5 mx-auto my-5 mt-20 gap-10 h-[100%]">
        <div className="font-bold text-3xl">
            Hi, {user.getUser.username}! 🎉 
            <br/>
            Welcome to &lt;InfoConquer/&gt;!
        </div>
        <div>
            <p className="text-3xl font-bold mb-2">Deciding what to do?</p>
            <div className="flex gap-10 justify-center max-lg:flex-col">
                <Card as={Link} href={"/problems"} className="flex flex-col flex-1 bg-green-500 h-full">
                    <CardHeader className="pt-10 flex justify-center items-center">
                        <svg height={100} xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 640 512">
                            <path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"/>
                        </svg>
                    </CardHeader>
                    <CardBody>
                        <p className="text-3xl font-bold text-center">Solve problems</p>
                        <p className="text-default-foreground text-center">
                            Start conquering!
                        </p>
                    </CardBody>
                </Card>
                <Card as={Link} href={"/calendar"} className="flex flex-col flex-1 bg-yellow-400  h-full">
                    <CardHeader className="pt-10 flex justify-center items-center">
                        <Calendar/>
                    </CardHeader>
                    <CardBody>
                        <p className="text-3xl font-bold text-center">Daily problem</p>
                        <p className="text-default-foreground text-center">
                            See today's daily
                        </p>
                    </CardBody>
                </Card>
                <Card as={Link} href={"/problems"} className="flex flex-col bg-blue-400 flex-1 h-full">
                    <CardHeader className="pt-10 flex justify-center items-center">
                        <Trophy/>
                    </CardHeader>
                    <CardBody>
                        <p className="text-3xl font-bold text-center">Feeling comp?</p>
                        <p className="text-default-foreground text-center">
                            Participate in a contest
                        </p>
                    </CardBody>
                </Card>
                <Card as={Link} href={"/articles/publish"} className="flex flex-col flex-1 bg-red-500 h-full">
                    <CardHeader className="pt-10 flex justify-center items-center">
                        <Article/>
                    </CardHeader>
                    <CardBody>
                        <p className="text-3xl font-bold text-center">Feeling artsy?</p>
                        <p className="text-default-foreground text-center">
                            Publish an article
                        </p>
                    </CardBody>
                </Card>
            </div>
        </div>
        <div>
            <p className="text-3xl font-bold mb-2">Your activity in the last 7 days</p>
            {getInfo.data && (
                <Chart
                    chartType="LineChart"
                    data={[
                        ['Date', 'Subs'],
                        ...getInfo.data.getHomepageInfo.lastSeven.map((obj) => [new Date(+obj.date).toDateString(), obj.count])
                    ]}
                    width="100%"
                    height="400px"
                    legendToggle
                />
            )}
        </div>
        <div>
            <p className="text-3xl font-bold mb-2">Newest annoncements</p>
            <div className="flex flex-col gap-5 max-md:w-[100%] mb-5">
                {getAnnouncements.data.getAnnouncements.map((announcement, index) => (
                    <Card key={index}>
                        <CardBody>
                            <p className="text-2xl font-bold">{announcement.title}</p>
                            <p className="text-slate">Announcement by <Link to={`/profile/${announcement.createdBy}`} color="danger" >{announcement.createdBy}</Link></p>
                            <div dangerouslySetInnerHTML={{__html: announcement.content.slice(0, 500) + `... <a target='_blank' style='color: rgb(51,102,204);' href='/announcement/${announcement.title}'>Vezi mai multe</a>`}}></div>
                        </CardBody>
                    </Card>
                ))}
            </div>
            <div className="flex flex-col gap-2 mt-4 w-full">
                <p className="text-2xl font-bold text-end">Top problems</p>
                <Table isStriped isCompact>
                    <TableHeader>
                        <TableColumn>Title</TableColumn>
                            <TableColumn>Difficulty</TableColumn>
                            <TableColumn>Success rate</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {getInfo.data && getInfo.data.getHomepageInfo.topProblems.map((problem, index) => (
                                <TableRow key={index}>
                                    <TableCell className="cursor-pointer">
                                        <Link color="danger" href={`/problems/${problem.title}`}>{problem.title}</Link>
                                    </TableCell>
                                    <TableCell>{problem.difficulty}</TableCell>
                                    <TableCell>{parseInt(problem.successRate)}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
            </div>
        </div>
       </div>
    )
}