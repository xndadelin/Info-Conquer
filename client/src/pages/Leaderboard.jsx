import {gql, useQuery} from '@apollo/client'
import {Loading} from '../components/Loading'
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from '@nextui-org/react'
export const Leaderboard = () => {
    const getLeaderboard = gql`
    query getLeaderboard {
        getLeaderboard {
            username
            solvedProblems
        }
    }
    `
    const {data, loading} = useQuery(getLeaderboard)
    if(loading) return <Loading/>
    return (
        <div className="container flex flex-col px-5 mx-auto mt-20 gap-10 mb-[100vh]">
            <div className="flex flex-col gap-5">
                <div className="text-5xl text-white font-extrabold">🚀 Leaderboard</div>
                <p className="text-2xl text-white">Here you can see the top users who have solved the most problems!</p>
            </div>
            <div className="flex flex-col gap-5">
                <Table isStriped isCompact>
                    <TableHeader>
                        <TableColumn>Top</TableColumn>
                        <TableColumn>Username</TableColumn>
                        <TableColumn>Solved problems</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {data.getLeaderboard.map((row, index) => (
                            <TableRow>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{row.username}</TableCell>
                                <TableCell>{row.solvedProblems}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}