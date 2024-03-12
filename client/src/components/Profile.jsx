import {Link, useParams} from "react-router-dom"
import {useQuery, gql} from "@apollo/client";
import {useState} from "react";
import {Loading} from "./Loading";
import {Button, ButtonGroup, Divider} from "@nextui-org/react";
import {
    Avatar,
    Tabs,
    Tab,
    Chip,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell, Pagination, Card, CardHeader, CardBody
} from "@nextui-org/react";
export const Profile = () => {
    const {username} = useParams();
    const [user, setUser] = useState();
    const [page, setPage] = useState(1)
    const [love, setLove] = useState(false)
    const userQuery = gql`
        query GetProfile($username: String){
            getProfile(username: $username){
                username,
                createdAt,
                admin,
                solutions {
                    problem,
                    score,
                    date,
                    compilationError,
                    id_solution,
                    language
                },
                solvedProblems
            }
        }
    `
    const {data, loading, error} = useQuery(userQuery, {
        variables: {
            username
        },
        onError: (error) => {
            console.error(error)
        },
        onCompleted: (data) => {
            setUser(data)
        }

    })
    // to do: fix
    if(loading || !user){
        return  <Loading/>
    }
    return (
        <Tabs className="container mx-auto flex flex-col my-5 px-5">
            <Tab key="general" title="General informations" className="mx-auto container p-5">
                <div className='flex flex-col gap-6'>
                    <div className='flex'>
                        <Card className="w-full">
                            <CardHeader className="text-2xl flex justify-center">InfoConquer enjoyer</CardHeader>
                            <CardBody>
                                <Avatar className="self-center"></Avatar>
                                <p className="text-3xl self-center">{user.getProfile.username}</p>
                                <p className="mb-3 text-2xl self-center text-default-500">{user.getProfile.admin === "true" ? "Admin": 'User'}</p>
                                <div className="self-center">
                                    <ButtonGroup>
                                        <Button onClick={() => setLove(!love)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill={love ? 'red': 'white'} viewBox="0 0 512 512">
                                                <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
                                            </svg>
                                        </Button>
                                        <Button>
                                            <svg xmlns="http://www.w3.org/2000/svg" width={25} fill="white" viewBox="0 0 448 512">
                                                <path d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32V64 368 480c0 17.7 14.3 32 32 32s32-14.3 32-32V352l64.3-16.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L64 48V32z"/>
                                            </svg>
                                        </Button>
                                        <Button>
                                            <svg xmlns="http://www.w3.org/2000/svg"  fill="white" viewBox="0 0 448 512">
                                                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                                            </svg>
                                        </Button>
                                    </ButtonGroup>
                                    <Divider className="mt-5"/>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-3xl">Solved problems</p>
                        <div className="flex flex-wrap">
                            {user.getProfile.solvedProblems.map((problem) => (
                                <Chip className="m-2">
                                    <Link to={`/problems/${problem}`}>{problem}</Link>
                                </Chip>
                            ))}
                            {user.getProfile.solvedProblems.length === 0 &&
                                <div>{'The user has not solved problems.'}</div>}
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p className="text-3xl">Submited solutions</p>
                        <Table isStriped>
                            <TableHeader>
                                <TableColumn>Index</TableColumn>
                                <TableColumn>Problem</TableColumn>
                                <TableColumn>Date</TableColumn>
                                <TableColumn>Language</TableColumn>
                                <TableColumn>Score</TableColumn>
                                <TableColumn>Status</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {user.getProfile.solutions.slice((page - 1)*20, page*20).map((solution) => (
                                    <TableRow>
                                        <TableCell>
                                            <Link to={`/solution/${username}/${solution.id_solution}`}>See solution</Link>
                                        </TableCell>
                                        <TableCell>
                                            <Link to={`/problems/${username}/${solution.problem}`}>{solution.problem}</Link>
                                        </TableCell>
                                        <TableCell>{solution.date}</TableCell>
                                        <TableCell>{solution.language}</TableCell>
                                        <TableCell>{solution.score}</TableCell>
                                        <TableCell>{solution.compilationError ? 'Rejected' : 'Accepted'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Pagination onChange={(page) => setPage(page)} loop showControls total={Math.ceil(user.getProfile.solutions.length/20)} initialPage={1}></Pagination>
                    </div>
                </div>
            </Tab>
            <Tab  key="settings" title="Settings" className="mx-auto container">

            </Tab>
        </Tabs>
    )
}