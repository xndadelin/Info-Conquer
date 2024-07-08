import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tabs, Tab, Pagination, Input, Button } from "@nextui-org/react";
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

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>

);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>

);

const CodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
    </svg>

);

const ArticleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
    </svg>

);

const TrophyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
    </svg>

);

export const Search = () => {
    const { query } = useParams();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("users");
    const [searchQuery, setSearchQuery] = useState(query);
    const [pages, setPages] = useState({
        users: 1,
        problems: 1,
        articles: 1,
        contests: 1
    });

    const { data, loading, error, refetch } = useQuery(SEARCH_QUERY, {
        variables: { query },
    });

    const handleSearch = () => {
        refetch({ query: searchQuery });
    };

    if (loading) return <Loading />;
    if (error) return <NotFound />;

    if (!data || !data.getSearch || data.getSearch.totalResults === 0) {
        return (
            <div className="container mx-auto h-screen w-screen my-5 p-3 text-center">
                <h2 className="text-3xl font-bold mb-4">{t("search.noResults")}</h2>
                <p className="text-gray-500">{t("search.tryDifferentQuery")}</p>
            </div>
        );
    }

    const renderTable = (items, type, page) => {
        const currentPage = pages[type];
        const startIndex = (currentPage - 1) * 10;
        const endIndex = startIndex + 10;

        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
                        <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="px-6 py-3 rounded-tl-lg" scope="col">{t("search.index")}</th>
                                <th className="px-6 py-3 rounded-tr-lg" scope="col">{t(`search.${type}`)}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {items.slice(startIndex, endIndex).map((item, index) => (
                                <tr
                                    key={startIndex + index}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">{startIndex + index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link
                                            className="text-blue-600 dark:text-blue-400 hover:underline"
                                            to={`/${page}/${item}`}
                                        >
                                            {item}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    total={Math.ceil(items.length / 10)}
                    page={currentPage}
                    onChange={(value) => setPages({ ...pages, [type]: value })}
                    className="mt-4 flex justify-center"
                    size="lg"
                    color="primary"
                    showControls
                    loop
                />
            </div>
        );
    };

    return (
        <div className="container mx-auto max-w-6xl my-12 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">{t("search.title")}</h1>
                <div className="flex gap-2">
                    <Input
                        placeholder={t("search.placeholder")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        contentLeft={<SearchIcon />}
                        className="flex-grow"
                    />
                    <Button auto onClick={handleSearch} color="primary" onKeyDown={(e) => {}}>
                        {t("search.button")}
                    </Button>
                </div>
            </div>

            <Tabs
                selectedKey={activeTab}
                onSelectionChange={setActiveTab}
                color="primary"
                className="mb-6"
            >
                <Tab key="users" title={<div className="flex items-center"><UserIcon /><span className="ml-2">{t("search.users")}</span></div>}>
                    {renderTable(data.getSearch.users, "users", "profile")}
                </Tab>
                <Tab key="problems" title={<div className="flex items-center"><CodeIcon /><span className="ml-2">{t("search.problems")}</span></div>}>
                    {renderTable(data.getSearch.problems, "problems", "problems")}
                </Tab>
                <Tab key="articles" title={<div className="flex items-center"><ArticleIcon /><span className="ml-2">{t("search.articles")}</span></div>}>
                    {renderTable(data.getSearch.articles, "articles", "articles")}
                </Tab>
                <Tab key="contests" title={<div className="flex items-center"><TrophyIcon /><span className="ml-2">{t("search.contests")}</span></div>}>
                    {renderTable(data.getSearch.contests, "contests", "contests")}
                </Tab>
            </Tabs>
        </div>
    );
};