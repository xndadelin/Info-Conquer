import { Link, useParams } from "react-router-dom"
import { useQuery, gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { Loading } from "./Loading";
import { Button, ButtonGroup, Divider, Textarea } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { Avatar, Tabs, Tab, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Card, CardHeader, CardBody } from "@nextui-org/react";
import { NotFound } from "../pages/NotFound";
import { useTranslation } from 'react-i18next'
const userQuery = gql`
query GetProfile($username: String){
    getProfile(username: $username){
        username,
        createdAt,
        admin,
        solutions {
            problem,
            score,
            date,
            compilationError,
            id_solution,
            language
        },
        solvedProblems {
            problem
        }
    }
}
`
const updateUsername = gql`
mutation changeUsername($username: String, $newUsername: String){
    changeUsername(username: $username, newUsername: $newUsername){
        success
    }
}`
const updateEmail = gql`
mutation changeEmail($email: String, $newEmail: String){
    changeEmail(email: $email, newEmail: $newEmail){
        success
    }
}`
const updatePassword = gql`
mutation changePassword($currentpass: String, $password: String, $confirmPassword: String){
    changePassword(currentpass: $currentpass, password: $password, confirmPassword: $confirmPassword){
        success
    }

}`
const logoutMutationQuery = gql`
mutation {
    logout {
        success
    }
}`
const getActivity = gql`
    query getActivity($username: String){
        getActivity(username: $username) {
            date
            message
        }
    }
`

export const Profile = () => {
    const { username } = useParams();
    const { t } = useTranslation()

    const { user: currentUser } = useContext(UserContext)
    const [page, setPage] = useState(1)
    const [love, setLove] = useState(false)
    const [error, setError] = useState('')
    const [newUsername, setNewUsername] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [email, setEmail] = useState('')
    const [bio, setBio] = useState('')
    const [logoutMutation] = useMutation(logoutMutationQuery)
    const [errorUsername, setErrorUsername] = useState('')
    const [errorEmail, setErrorEmail] = useState('')
    const [currentpass, setCurrentPass] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorPassword, setErrorPassword] = useState('')
    const [pageActivity, setPageActivity] = useState(1)

    const { data: dataActivity, loading: loadingActivity } = useQuery(getActivity, {
        variables: {
            username
        }
    })
    const { data, loading } = useQuery(userQuery, {
        variables: {
            username
        },
        onError: (error) => {
            setError(error)
        }
    })

    const [changeUsername, { loading: changeUsernameLoading }] = useMutation(updateUsername, {
        variables: {
            username,
            newUsername
        },
        onCompleted: () => {
            logoutMutation()
            window.location.href = '/login'
        },
        onError: (error) => {
            setErrorUsername(error.message)
        }
    })
    const [changeEmail, { loading: changeEmailLoading }] = useMutation(updateEmail, {
        variables: {
            email,
            newEmail
        },
        onCompleted: () => {
            logoutMutation()
            window.location.href = '/login'
        },
        onError: (error) => {
            setErrorEmail(error.message)
        }
    })
    const [changePassword, { loading: changePasswordLoading }] = useMutation(updatePassword, {
        variables: {
            currentpass,
            password,
            confirmPassword
        },
        onCompleted: () => {
            logoutMutation()
            window.location.reload()
        },
        onError: (error) => {
            setErrorPassword(error.message)
        }
    })

    if (loading || loadingActivity) return <Loading />
    if (!data || error) return <NotFound />

    const seeSettings = currentUser && currentUser.getUser && currentUser.getUser.username === username

    return (
        <div className="h-[100%] my-5 min-h-[3000px]">
            <Tabs className="container mx-auto flex flex-col my-5 px-5">
                <Tab key="general" title={t("profile.generalInformation")} className="mx-auto container p-5">
                    <div className="flex flex-col gap-6 h-screen">
                        <div className="flex">
                            <Card className="w-full">
                                <CardHeader className="text-2xl flex justify-center">{t("profile.generalInformation")}</CardHeader>
                                <CardBody>
                                    <Avatar className="self-center"></Avatar>
                                    <p className="text-3xl self-center">{data.getProfile.username}</p>
                                    <p className="mb-3 text-2xl self-center text-default-500">
                                        {data.getProfile.admin === "true" ? t("profile.admin") : t("profile.user")}
                                    </p>
                                    <div className="self-center">
                                        <ButtonGroup>
                                            <Button onClick={() => setLove(!love)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill={love ? "red" : "white"} viewBox="0 0 512 512">
                                                    <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                                                </svg>
                                            </Button>
                                            <Button>
                                                <svg xmlns="http://www.w3.org/2000/svg" width={25} fill="white" viewBox="0 0 448 512">
                                                    <path d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32V64 368 480c0 17.7 14.3 32 32 32s32-14.3 32-32V352l64.3-16.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L64 48V32z" />
                                                </svg>
                                            </Button>
                                            <Button>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 448 512">
                                                    <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                                                </svg>
                                            </Button>
                                        </ButtonGroup>
                                        <Divider className="mt-5" />
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-3xl">{t("profile.solvedProblems")}</p>
                            <div className="flex flex-wrap">
                                {data.getProfile.solvedProblems.map((problem) => (
                                    <Chip className="m-2">
                                        <Link to={`/problems/${problem.problem}`}>{problem.problem}</Link>
                                    </Chip>
                                ))}
                                {data.getProfile.solvedProblems.length === 0 && <div>{t("profile.noSolvedProblems")}</div>}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 mb-10">
                            <p className="text-3xl">{t("profile.submittedSolutions")}</p>
                            <Table isStriped>
                                <TableHeader>
                                    <TableColumn>{t("profile.index")}</TableColumn>
                                    <TableColumn>{t("profile.problem")}</TableColumn>
                                    <TableColumn>{t("profile.date")}</TableColumn>
                                    <TableColumn>{t("profile.language")}</TableColumn>
                                    <TableColumn>{t("profile.score")}</TableColumn>
                                    <TableColumn>{t("profile.status")}</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {data.getProfile.solutions.slice((page - 1) * 20, page * 20).map((solution) => (
                                        <TableRow key={solution.id_solution}>
                                            <TableCell>
                                                <Link to={`/solution/${username}/${solution.id_solution}`}>{t('profile.see_solution')}</Link>
                                            </TableCell>
                                            <TableCell>
                                                <Link to={`/problems/${solution.problem}`}>{solution.problem}</Link>
                                            </TableCell>
                                            <TableCell>{new Date(+solution.date).toLocaleString()}</TableCell>
                                            <TableCell>{solution.language}</TableCell>
                                            <TableCell>{solution.score}</TableCell>
                                            <TableCell>{solution.score === "100" ? "Accepted" : "Rejected"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Pagination
                                color="danger"
                                onChange={(page) => setPage(page)}
                                loop
                                showControls
                                total={Math.ceil(data.getProfile.solutions.length / 20)}
                                initialPage={1}
                            />
                        </div>
                        <p className="text-3xl">{t("profile.activity")}</p>
                        <div className="space-y-4 p-4 rounded-lg bg-[#27272A]">
                            {dataActivity &&
                                dataActivity.getActivity.slice((pageActivity - 1) * 10, pageActivity * 10).map((activity) => (
                                    <div key={activity.id} className="flex items-center gap-4 p-3 bg-[#18181B] rounded-lg">
                                        <span className="text-sm text-gray-400">{new Date(+activity.date).toLocaleString()}</span>
                                        <span className="text-base text-gray-200">{activity.message}</span>
                                    </div>
                                ))}
                            <Pagination
                                color="danger"
                                onChange={setPageActivity}
                                showControls
                                total={Math.ceil(dataActivity.getActivity.length / 10)}
                                initialPage={1}
                            />
                        </div>
                    </div>
                </Tab>
                {seeSettings && (
                    <Tab key="settings" title={t("profile.settings")} className="mx-auto container p-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex flex-col gap-4 mt-4">
                                <div className="flex flex-col gap-1">
                                    <p className="text-3xl">{t("profile.changeUsername")}</p>
                                    <Input label={t("profile.username")} value={data.getProfile.username} disabled />
                                    <Input label={t("profile.newUsername")} onChange={(e) => setNewUsername(e.target.value)} />
                                    <Button onClick={changeUsername} isLoading={changeUsernameLoading} color="danger" variant="flat">
                                        {t("profile.changeUsername")}
                                    </Button>
                                    {errorUsername && <Chip color="danger" variant="flat">{errorUsername}</Chip>}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-3xl">{t("profile.changeEmail")}</p>
                                    <p className="text-default-500">{t("profile.yourEmail")}</p>
                                    <Input label={t("profile.email")} onChange={(e) => setEmail(e.target.value)} value={email} />
                                    <Input label={t("profile.newEmail")} value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                                    <Button color="danger" variant="flat" onClick={changeEmail} isLoading={changeEmailLoading}>
                                        {t("profile.changeEmail")}
                                    </Button>
                                    {errorEmail && <Chip color="danger" variant="flat">{errorEmail}</Chip>}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-3xl">{t("profile.changePassword")}</p>
                                    <Input label={t("profile.currentPassword")} value={currentpass} onChange={(e) => setCurrentPass(e.target.value)} type="password" />
                                    <Input label={t("profile.newPassword")} value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
                                    <Input label={t("profile.confirmPassword")} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" />
                                    <Button color="danger" variant="flat" onClick={changePassword} isLoading={changePasswordLoading}>
                                        {t("profile.changePassword")}
                                    </Button>
                                    {errorPassword && <Chip color="danger" variant="flat">{errorPassword}</Chip>}
                                </div>
                            </div>
                        </div>
                        <Divider className="mt-4" />
                        <div className="flex flex-col gap-4 mt-4">
                            <p className="text-3xl">{t("profile.bio")}</p>
                            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} label={t("profile.writeAboutYourself")} />
                            <Button color="danger" variant="flat">{t("profile.changeBio")}</Button>
                        </div>
                        <Divider className="mt-4" />
                    </Tab>
                )}
            </Tabs>
        </div>
    )
}
