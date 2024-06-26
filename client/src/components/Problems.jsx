import { Link, useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Chip, Pagination } from "@nextui-org/react";
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
  const { data, loading } = useQuery(gqlProblems, {
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
      <Table isCompact isStriped>
        <TableHeader>
          <TableColumn>{t('problemsPage.table.id')}</TableColumn>
          <TableColumn>{t('problemsPage.table.category')}</TableColumn>
          <TableColumn>{t('problemsPage.table.subcategories')}</TableColumn>
          <TableColumn>{t('problemsPage.table.difficulty')}</TableColumn>
        </TableHeader>
        <TableBody>
          {problems.getProblems.slice((page - 1) * 20, page * 20).map((problem) => (
            <TableRow key={problem.title}>
              <TableCell>
                <Link to={`/problems/${problem.title}`}>{problem.title}</Link>
              </TableCell>
              <TableCell>{t(`problems.categories.${problem.category}`)}</TableCell>
              <TableCell>
                {problem.subcategories.map((subcategory, index) => (
                  <Chip key={index}>{subcategory}</Chip>
                ))}
              </TableCell>
              <TableCell>{problem.difficulty}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        color="danger"
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
