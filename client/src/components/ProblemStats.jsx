import {gql, useQuery} from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import { Loading } from "./Loading";
import {Chart} from 'react-google-charts'
const getStats = gql`
    query GetProblemStats($id: String) {
        getProblemStats(id: $id) {
        bestMemory {
            language
            date
            memory
            username
        }
        firstSubmissions {
            date
            language
            username
        }
        timeExecution {
            date
            language
            timeExecutions
            username
        }
        solves {
            count
            date
        }
        }
    }
`
export const ProblemStats = () => {
    const {id} = useParams();
    const {loading, error, data} = useQuery(getStats, {
        variables: {
            id
        },
    })
    if(loading) return <Loading/>
    if(!data || !data.getProblemStats) return <Loading/>
    return (
        <div className="container flex-col">
            <Chart
                chartType="LineChart"
                data={[
                    ['Date', 'Solves'],
                    ...data.getProblemStats.solves.map((solve) => [new Date(+solve.date).toDateString(), solve.count])
                ]}
                width="100%"
                height="400px"
                legendToggle
            />
        </div>
    )
}