import { gql, useQuery } from "@apollo/client"
import {Loading} from '../components/Loading'
import { Card, CardBody, CardHeader } from "@nextui-org/react"
import { Link } from "react-router-dom"
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
export const Contests = () => {
    const {data, error, loading} = useQuery(getContests)
    if(loading) return <Loading/>
    return (
        <div className="container p-4 grid grid-cols-3 my-5 gap-5">
            {data.getContests.map((contest) => (
                <Card>
                    <CardHeader className="grid col-span-2">
                        <Link className="text-3xl font-bold" target="_blank" to={`/contest/view/${contest._id}`}>
                            {contest.name}
                        </Link>
                        <p className="text-gray-400">Created by {contest.createdBy}</p>
                    </CardHeader>
                    <CardBody>
                        <p className="text-xl font-bold">Description</p>
                        <p className="text-xl" dangerouslySetInnerHTML={{__html: contest.description.slice(0, 100) + '...' + `<a target='_blank' style='color: rgb(51,102,204);' href='/contests/view/${contest._id}'>Vezi mai multe</a>`}}></p>
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
                </Card>
            ))}
        </div>
    )
}