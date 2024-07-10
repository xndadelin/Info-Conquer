import  { Chip } from "@nextui-org/react"
import { Pagination } from "@nextui-org/react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { getStatusColor } from "../utils/getStatusColor"

export const SubmissionsTable = ({ submissions, page, setPage }) => {
    
    const { t } = useTranslation()

    return submissions && (
        <section>
            <table className="w-full text-sm text-gray-300 border-collapse shadow-2xl" aria-label="All submissions">
                    <thead className="bg-gray-800">
                    <tr>
                        <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('submissions.username')}</th>
                        <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('submissions.language')}</th>
                        <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('submissions.score')}</th>
                        <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('submissions.date')}</th>
                        <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">{t('submissions.status')}</th>
                    </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-700">
                    {submissions.slice((page - 1) * 20, page * 20).map((submission, index) => (
                        <tr className={index % 2 === 1 ? 'bg-gray-800' : 'bg-gray-900'}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Link to={`/profile/${submission.username}`} className="text-blue-300 hover:text-blue-200 transition-colors">
                                    {submission.username}
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
                    total={Math.ceil(submissions.length / 20)}
                    page={page}
                    onChange={setPage}
                    className='mt-5'
                    showControls
                    loop
                />
        </section>
    )
}