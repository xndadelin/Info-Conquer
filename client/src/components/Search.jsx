import { gql, useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tabs, Tab, TableHeader, TableRow, TableColumn, Table, TableBody, TableCell } from "@nextui-org/react";
import { Loading } from "./Loading";
import { NotFound } from "../pages/NotFound";

const SEARCH_QUERY = gql`
    query GetSearch($query: String) {
        getSearch(query: $query) {
            users
            problems
            articles
            contests
            totalResults
        }
    }
`;

export const Search = () => {
    const { query } = useParams();
    const { t } = useTranslation();
    const { data, loading, error } = useQuery(SEARCH_QUERY, {
        variables: { query },
    });

    if (loading) return <Loading />;
    if (error) return <NotFound />;
    if (!data || !data.getSearch || data.getSearch.totalResults === 0) {
        return (
            <div className="container mx-auto h-screen w-screen my-5 p-3 text-center text-3xl">
                {t("search.noResults")}
            </div>
        );
    }

    return (
        <div className="container mx-auto h-screen w-screen my-5 p-3">
            <Tabs>
                <Tab title={t("search.users")}>
                    <Table>
                        <TableHeader>
                            <TableColumn>{t("search.users")}</TableColumn>
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
                <Tab title={t("search.problems")}>
                    <Table>
                        <TableHeader>
                            <TableColumn>{t("search.problems")}</TableColumn>
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
                <Tab title={t("search.articles")}>
                    <Table>
                        <TableHeader>
                            <TableColumn>{t("search.articles")}</TableColumn>
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
                <Tab title={t("search.contests")}>
                    <Table>
                        <TableHeader>
                            <TableColumn>{t("search.contests")}</TableColumn>
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
    );
};
