import { Link, useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { Pagination } from "@nextui-org/react";
import { Loading } from "./Loading";
import { useTranslation } from 'react-i18next';

export const Problems = () => {
  const { t } = useTranslation();

  const [problems, setProblems] = useState(null);
  const [page, setPage] = useState(1);
  const { category, subcategory } = useParams();
  const gqlProblems = gql`
    query GetProblems($category: String, $subcategory: String) {
      getProblems(category: $category, subcategory: $subcategory) {
        category
        creator
        description
        difficulty
        type
        title
        subcategories
      }
    }
  `;
  const { loading } = useQuery(gqlProblems, {
    variables: {
      category,
      subcategory,
    },
    onCompleted: (data) => {
      setProblems(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  if (loading || !problems) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto my-10 p-4">
      <p className="text-6xl mb-5">{t('problemsPage.title')}</p>
      <table className="w-full text-sm text-gray-300 border-collapse shadow-2xl rounded-tr">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('problemsPage.table.id')}</th>
            <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('problemsPage.table.category')}</th>
            <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('problemsPage.table.subcategories')}</th>
            <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('problemsPage.table.difficulty')}</th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {problems.getProblems.slice((page - 1) * 20, page * 20).map((problem, index) => (
            <tr key={problem.title} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link to={`/problems/${problem.title}`} className="text-blue-300 hover:text-blue-200 transition-colors">
                  {problem.title}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {t(`problems.categories.${problem.category}`)}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {problem.subcategories.map((subcategory, index) => (
                    <span key={index} className="px-2 py-1 text-xs font-medium bg-gray-700 rounded-full">
                      {subcategory}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {problem.difficulty}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        color="primary"
        className="pt-5"
        onChange={(page) => setPage(page)}
        loop
        total={Math.ceil(problems.getProblems.length / 25)}
        initialPage={1}
        showControls
        nextText={t('problemsPage.pagination.next')}
        prevText={t('problemsPage.pagination.prev')}
      />
    </div>
  );
};
