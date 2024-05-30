import { gql, useQuery } from "@apollo/client"
import { Link, useParams } from "react-router-dom"
import { Loading } from "./Loading"
import { NotFound } from "../pages/NotFound"
import { Tabs, Tab, TableHeader, TableRow, TableColumn, Table, TableBody, TableCell } from "@nextui-org/react"
const searchGql = gql`
    query getSearch($query: String){
        getSearch(query: $query){
            users
            problems
            articles
            contests
            totalResults
        }
    }
`
export const Search = () => {
    const {query} = useParams()
    const {data, loading, error} = useQuery(searchGql, {
        variables: {
            query
        },
        onError: (error) => {
            //do nothing for now
        }
    })
    if(loading) return <Loading/>
    if(error) return <NotFound/>
    if(!data || !data.getSearch || data.getSearch.totalResults === 0) return <NotFound/>
    return (
        <div className="container mx-auto h-screen w-screen my-5 p-3 ">
            <Tabs className="flex flex-col">
                <Tab title="Users">
                    <Table>
                        <TableHeader>
                            <TableColumn>Username</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {data.getSearch.users.map((user, index) => (
                                <TableRow key={index}>
                                   <TableCell>
                                        <Link to={`/profile/${user}`}>{user}</Link>
                                   </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Tab>
                <Tab title="Problems">
                    <Table>
                        <TableHeader>
                            <TableColumn>Title</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {data.getSearch.problems.map((problem, index) => (
                                <TableRow key={index}>
                                   <TableCell>
                                        <Link to={`/problems/${problem}`}>{problem}</Link>
                                   </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Tab>
                <Tab title="Articles">
                    <Table>
                        <TableHeader>
                            <TableColumn>Title</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {data.getSearch.articles.map((article, index) => (
                                <TableRow key={index}>
                                   <TableCell>
                                        <Link to={`/articles/${article}`}>{article}</Link>
                                   </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Tab>
                <Tab title="Contests">
                    <Table>
                        <TableHeader>
                            <TableColumn>Title</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {data.getSearch.contests.map((contest, index) => (
                                <TableRow key={index}>
                                   <TableCell>
                                        <Link to={`/contests/${contest}`}>{contest}</Link>
                                   </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Tab>
            </Tabs>
        </div>  
    )
}