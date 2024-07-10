import { Link } from 'react-router-dom';
import { Chip } from '@nextui-org/react';
import { Pagination } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { getStatusColor } from '../utils/getStatusColor';

export const UserSolutionsTable = ({ submissions, userPage, setUserPage }) => {
    
    const { t } = useTranslation()

    return submissions && (
        <section>
            <table className="w-full text-sm text-gray-300 border-collapse shadow-2xl" aria-label="User submissions">
                <thead className="bg-gray-800">
                    <tr>
                        <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('submissions.seeSolution')}</th>
                        <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('submissions.language')}</th>
                        <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('submissions.score')}</th>
                        <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('submissions.date')}</th>
                        <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('submissions.status')}</th>
                    </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-700">
                    {submissions.slice((userPage - 1) * 20, userPage * 20).map((submission, index) => (
                        <tr className={index % 2 === 1 ? 'bg-gray-800' : 'bg-gray-900'}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Link to={`/solution/${submission.username}/${submission._id}`} className="text-blue-300 hover:text-blue-200 transition-colors">
                                    See solution
                                </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{submission.language}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{submission.score}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{new Date(+submission.date).toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Chip className={`px-2 py-1 text-xs font-medium rounded-full`} color={getStatusColor(submission.status)}>
                                    {submission.status}
                                </Chip>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination
                color='primary'
                className="mt-4"
                onChange={(page) => setUserPage(page)}
                total={Math.ceil(submissions.length / 20)}
                initialPage={1}
                showControls
                loop
            />
        </section>
    )
}
