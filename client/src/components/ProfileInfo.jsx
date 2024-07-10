import { Card, CardBody, CardHeader, Chip, Pagination } from "@nextui-org/react"
import { Link } from "react-router-dom"
export const ProfileInfo = ({ t, data, page, setPage, getStatusColor, dataActivity, setPageActivity, pageActivity }) => {
    return (
        <>
            <Card className="p-6 bg-gray-800">
                <CardHeader>
                    <h2 className="text-2xl font-bold">{t("profile.solvedProblems")}</h2>
                </CardHeader>
                <CardBody>
                    <div className="flex flex-wrap gap-2">
                        {data.getProfile.solvedProblems.map((problem) => (
                            <Chip key={problem.problem} color="success" variant="flat">
                                <Link to={`/problems/${problem.problem}`}>{problem.problem}</Link>
                            </Chip>
                        ))}
                        {data.getProfile.solvedProblems.length === 0 &&
                            <p className="text-gray-500">{t("profile.noSolvedProblems")}</p>
                        }
                    </div>
                </CardBody>
            </Card>

            <Card className="mt-8 p-6 bg-gray-800">
                <CardHeader>
                    <h2 className="text-2xl font-bold">{t("profile.submittedSolutions")}</h2>
                </CardHeader>
                <CardBody>
                    <table className="w-full text-sm text-left text-gray-300 shadow-2xl">
                        <thead className="text-xs uppercase bg-gray-700 text-gray-100">
                            <tr>
                                <th className="px-6 py-4" scope="col">{t("profile.problem")}</th>
                                <th className="px-6 py-4" scope="col">{t("profile.language")}</th>
                                <th className="px-6 py-4" scope="col">{t("profile.score")}</th>
                                <th className="px-6 py-4" scope="col">{t("profile.status")}</th>
                                <th className="px-6 py-4" scope="col">{t("profile.date")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {data.getProfile.solutions.slice((page - 1) * 10, page * 10).map((solution, index) => (
                                <tr onClick={() => {
                                    window.location.href = `/solution/${solution.username}/${solution.id_solution}`
                                }} className={`cursor-pointer hover:bg-gray-700 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}`}>
                                    <td className="px-6 py-4">
                                        <Link to={`/problems/${solution.problem}`}>{solution.problem}</Link>
                                    </td>
                                    <td className="px-6 py-4">{solution.language}</td>
                                    <td className="px-6 py-4">{solution.score}</td>
                                    <td className="px-6 py-4">
                                        <Chip color={getStatusColor(solution.status)}>{solution.status}</Chip>
                                    </td>
                                    <td>{new Date(+solution.date).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        color="primary"
                        onChange={setPage}
                        showControls
                        total={Math.ceil(data.getProfile.solutions.length / 10)}
                        initialPage={1}
                        className="mt-4"
                    />
                </CardBody>
            </Card>

            <Card className="mt-8 p-6 bg-gray-800">
                <CardHeader>
                    <h2 className="text-2xl font-bold">{t("profile.activity")}</h2>
                </CardHeader>
                <CardBody >
                    {dataActivity &&
                        dataActivity.getActivity.slice((pageActivity - 1) * 10, pageActivity * 10).map((activity) => (
                            <div className="mb-4 p-4 rounded-lg shadow-lg bg-gray-900">
                                <p className="text-sm text-gray-400 mb-1">{new Date(+activity.date).toLocaleString()}</p>
                                <p className="text-gray-200">{activity.message}</p>
                            </div>
                        ))}
                    <Pagination
                        color="primary"
                        onChange={setPageActivity}
                        showControls
                        total={Math.ceil(dataActivity.getActivity.length / 10)}
                        initialPage={1}
                    />
                </CardBody>
            </Card>
        </>
    )
}