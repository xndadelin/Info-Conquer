import {useQuery, gql} from "@apollo/client";
import {Card, CardBody, Button} from "@nextui-org/react";
import {Link} from "@nextui-org/react";
import { Loading } from "../components/Loading";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
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
    }
  }
`
export const Homepage = () => {
    const getAnnouncements = useQuery(newAnnouncements)
    const getInfo = useQuery(getInfos)
    if(getAnnouncements.loading) return <Loading/>
    if(getInfos.loading) return <Loading/>
    return (
       <div className="container flex flex-col px-5 mx-auto mt-20 gap-10">
        <div className="flex flex-row gap-2 max-md:flex-col justify-between max-md:justify-start">
            <div className="flex flex-col gap-5 flex-1">
                    <div className="text-5xl text-white font-extrabold">
                    🚀 Welcome to{' '}
                    <span className="from-[#ed3131] to-[#f9f7f5] cursor-pointer bg-clip-text text-transparent bg-gradient-to-b">
                        InfoConquer!
                    </span>{' '}
                    Your ultimate hub for problem-solving!
                    </div>
                    <p className="text-2xl text-white">InfoConquer is a platform where you can solve problems, read articles, and compete with other users. You can also create your own contests and invite your friends to join!</p>
            </div>
            <div className="flex-1 flex flex-col items-end pt-4 w-full">
               <p className="text-2xl font-bold">You can start solving problems by clicking <Link size="lg" isBlock color="danger" href={'/problems'}>here</Link> and choose!</p>
               <div className="flex flex-wrap gap-2 mt-4">
                    {[{href: '/problems', text: 'Problems'}, {href: '/contests', text: 'Contests'}, {href: '/articles', text: 'Articles'}, {href: '/announcements', text: 'Announcements'}].map((link) => (
                        <Link href={link.href}>
                            <Button variant="flat" color="danger">{link.text}</Button>
                        </Link>
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
        <p className="text-3xl font-bold">Newest annoncements</p>
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
       </div>
    )
}