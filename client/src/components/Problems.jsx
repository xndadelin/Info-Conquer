import {Link, useParams} from "react-router-dom";
import {gql, useQuery} from "@apollo/client";
import {useState} from "react";
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Chip, Pagination} from "@nextui-org/react";
import {Loading} from "./Loading";

export const Problems = () => {
    const [problems, setProblems] = useState(null)
    const [page, setPage] = useState(1)
    const {category, subcategory} = useParams();
    const gqlProblems = gql`
        query GetProblems($category: String, $subcategory: String){
            getProblems(category: $category, subcategory: $subcategory){
                category
                creator
                description
                difficulty
                type
                title
                subcategories
            }
        }
    `
    const {data, loading} = useQuery(gqlProblems, {
        variables: {
            category,
            subcategory
        },
        onCompleted: () => {
            setProblems(data)
        },
        onError: (error) => {
            console.log(error)
        }
    })
    if(loading || !problems){
        return <Loading/>
    }
    //to do pagination properly and filtering
    return (
        <div className="container mx-auto my-10">
            <p className="text-6xl mb-5">Problems</p>
            <Table>
                <TableHeader>
                    <TableColumn>#ID</TableColumn>
                    <TableColumn>Category</TableColumn>
                    <TableColumn>Subcategories</TableColumn>
                    <TableColumn>Type</TableColumn>
                    <TableColumn>Difficulty</TableColumn>
                </TableHeader>
                <TableBody>
                    {problems.getProblems.map((problem) => (
                        <TableRow>
                            <TableCell>
                                <Link to={`/problems/${problem.title}`}>{problem.title}</Link>
                            </TableCell>
                            <TableCell>{problem.category}</TableCell>
                            <TableCell>{problem.subcategories.map((subcategory) => (
                               <Chip>{subcategory}</Chip>
                            ))}</TableCell>
                            <TableCell>{problem.type}</TableCell>
                            <TableCell>{problem.difficulty}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination className="pt-5" total={Math.ceil(problems.getProblems.length/25)} initialPage={1} showControls />
        </div>
    )
}