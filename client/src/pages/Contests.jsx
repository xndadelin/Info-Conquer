import { gql, useQuery, useMutation } from "@apollo/client"
import {Loading} from '../components/Loading'
import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react"
import { Link } from "react-router-dom"
import { useContext, useState } from "react"
import { UserContext } from "../context/UserContext"
import { NotFound } from "./NotFound"
const getContests = gql`
    query GetContests {
        getContests {
            _id
            description
            endDate {
                minute
                day
                hour
                month
                year
            }
            languages
            name
            startDate {
                day
                hour
                minute
                year
                month
            }
            createdBy
        }
    }
`
const joinContest = gql`
    mutation JoinContest($id: String) {
        joinContest(id: $id) {
            success
        }
    }
`
export const Contests = () => {
    const {data, loading} = useQuery(getContests)
    const [id, setId] = useState('')
    const {user} = useContext(UserContext)
    const [joinContestMutation] = useMutation(joinContest, {
        onCompleted: (data) => {
            if(data.joinContest.success){
                window.location.href = `/contests/view/${id}`
            }
        }
    })
    if(loading) return <Loading/>
    if(!data || !user.getUser) return <NotFound/>
    return (
        <div className="mt-10 p-4 container mx-auto ">
            <div className="flex flex-col gap-5 self-start">
                <div className="text-5xl text-white font-extrabold">🏆 Contests</div>
                <p className="text-2xl text-white">
                    Here you can see all the contests hosted by this platform. You can join them and compete with other users!
                </p>
            </div>
            <div className="container grid grid-cols-3 my-5 mt-10 gap-5 max-md:grid-cols-2 max-sm:grid-cols-1">
                {data.getContests.map((contest) => (
                    <Card>
                        <CardHeader className="grid col-span-2">
                            <Link className="text-3xl font-bold" target="_blank" to={`/contests/view/${contest._id}`}>
                                {contest.name}
                            </Link>
                            <p className="text-gray-400">Created by {contest.createdBy}</p>
                        </CardHeader>
                        <CardBody>
                            <p className="text-xl font-bold">Description</p>
                            <p className="text-xl" dangerouslySetInnerHTML={{__html: contest.description.slice(0, 100) + `... <a target='_blank' style='color: rgb(51,102,204);' href='/contests/view/${contest._id}'>Vezi mai multe</a>`}}></p>
                            <p className="text-xl font-bold">Start date:</p>
                                {contest.startDate.year + '.' + contest.startDate.month + '.' + contest.startDate.day + ' at ' + contest.startDate.hour + ":" + contest.startDate.minute}
                            <p className="text-xl font-bold">End date:</p>
                                {contest.endDate.year + '.' + contest.endDate.month + '.' + contest.endDate.day + ' at ' + contest.endDate.hour + ":" + contest.endDate.minute}
                            <div className="flex flex-col">
                                <p className="text-xl font-bold">Languages:</p>
                                <div className="ml-3">
                                    {contest.languages.map((language) => (
                                        <li>{language}</li>
                                    ))}
                                </div>
                            </div>
                        </CardBody>
                        <CardFooter>
                            <Button onClick={() => {joinContestMutation({variables: {id: contest._id}}); setId(contest._id)}} variant="faded">Join contest</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}