import { Link, useParams } from "react-router-dom"
import { useQuery, gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { Loading } from "./Loading";
import { Button, ButtonGroup, Divider, Textarea } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { Avatar, Tabs, Tab, Chip, Pagination, Card, CardHeader, CardBody } from "@nextui-org/react";
import { NotFound } from "../pages/NotFound";
import { useTranslation } from 'react-i18next'
import { getStatusColor } from "../utils/getStatusColor";
const userQuery = gql`
query GetProfile($username: String){
    getProfile(username: $username){
        username
        createdAt
        admin
        profilePicture,
        solutions {
            problem
            score
            date
            compilationError,
            id_solution
            language
            status
            username
        }
        bio
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
const updateProfilePicture = gql`
mutation updateProfilePicture($profilePicture: String){
    updateProfilePicture(profilePicture: $profilePicture){
        success
    }
}
`
const updateBio = gql`
mutation updateBio($bio: String){
    updateBio(bio: $bio){
        success
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
    const [profilePicture, setProfilePicture] = useState('')

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

    const [updateProfilePictureMutation, { loading: updateProfilePictureLoading, error: updateProfilePictureError }] = useMutation(updateProfilePicture, {
        onCompleted: () => {
            window.location.reload()
        }
    })

    const [updateBioMutation, { loading: updateBioLoading, error: updateBioError }] = useMutation(updateBio, {
        onCompleted: () => {
            window.location.reload()
        }
    })
    
    if (loading || loadingActivity) return <Loading />
    if (!data || error) return <NotFound />

    const seeSettings = currentUser && currentUser.getUser && currentUser.getUser.username === username
    return (
    <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                <Card className="mb-8 bg-gray-800">
                    <CardBody className="flex flex-col md:flex-row md:items-start items-center gap-6 p-6">
                        <div>
                            <Avatar 
                                className="w-32 h-32 md:w-48 md:h-48"
                                src={data.getProfile.profilePicture}
                            />
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold mb-2">{data.getProfile.username}</h1>
                            <p className="text-xl text-gray-400 mb-4">
                                {data.getProfile.admin === "true" ? t("profile.admin") : t("profile.user")}
                            </p>
                            <ButtonGroup>
                                <Button color="primary" variant="flat">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 512 512">
                                        <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                                    </svg>
                                </Button>
                                <Button color="secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 448 512">
                                        <path d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32V64 368 480c0 17.7 14.3 32 32 32s32-14.3 32-32V352l64.3-16.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L64 48V32z" />
                                    </svg>
                                </Button>
                                <Button color="success">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 448 512">
                                        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                                    </svg>
                                </Button>
                            </ButtonGroup>
                            <p className="text-gray-400 mt-2">Created at: {new Date(+data.getProfile.createdAt).toLocaleString()}</p>
                            <p className="text-gray-400 mt-2">{t("profile.bio")}: {data.getProfile.bio}</p>
                        </div>
                    </CardBody>
                </Card>

                <Tabs className="mb-8" color="primary">
                    <Tab key="general" title={t("profile.generalInformation")}>
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
                    </Tab>

                    {seeSettings && (
                        <Tab key="settings" title={t("profile.settings")}>
                            <Card className="p-6 bg-gray-800">
                                <CardHeader>
                                    <h2 className="text-2xl font-bold">{t("profile.changeUsername")}</h2>
                                </CardHeader>
                                <CardBody className="space-y-4">
                                    <Input label={t("profile.username")} value={data.getProfile.username} disabled />
                                    <Input label={t("profile.newUsername")} onChange={(e) => setNewUsername(e.target.value)} />
                                    <Button color="primary" variant="flat" onClick={changeUsername} isLoading={changeUsernameLoading}>
                                        {t("profile.changeUsername")}
                                    </Button>
                                    {errorUsername && <Chip color="primary">{errorUsername}</Chip>}
                                </CardBody>
                            </Card>

                            <Card className="mt-8 p-6 bg-gray-800">
                                <CardHeader>
                                    <h2 className="text-2xl font-bold">{t("profile.changeEmail")}</h2>
                                </CardHeader>
                                <CardBody className="space-y-4">
                                    <Input label={t("profile.email")} onChange={(e) => setEmail(e.target.value)} value={email} />
                                    <Input label={t("profile.newEmail")} value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                                    <Button color="primary" variant="flat" onClick={changeEmail} isLoading={changeEmailLoading}>
                                        {t("profile.changeEmail")}
                                    </Button>
                                    {errorEmail && <Chip color="primary">{errorEmail}</Chip>}
                                </CardBody>
                            </Card>

                            <Card className="mt-8 p-6 bg-gray-800">
                                <CardHeader>
                                    <h2 className="text-2xl font-bold">{t("profile.changePassword")}</h2>
                                </CardHeader>
                                <CardBody className="space-y-4">
                                    <Input label={t("profile.currentPassword")} value={currentpass} onChange={(e) => setCurrentPass(e.target.value)} type="password" />
                                    <Input label={t("profile.newPassword")} value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
                                    <Input label={t("profile.confirmPassword")} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" />
                                    <Button color="primary" variant="flat" onClick={changePassword} isLoading={changePasswordLoading}>
                                        {t("profile.changePassword")}
                                    </Button>
                                    {errorPassword && <Chip color="primary">{errorPassword}</Chip>}
                                </CardBody>
                            </Card>

                            <Card className="mt-8 p-6 bg-gray-800">
                                <CardHeader>
                                    <h2 className="text-2xl font-bold">{t("profile.bio")}</h2>
                                </CardHeader>
                                <CardBody className="space-y-4">
                                    <Textarea value={bio} onChange={(e) => setBio(e.target.value)} label={t("profile.writeAboutYourself")} />
                                    <Button onClick={() => {
                                        updateBioMutation({
                                            variables: {
                                                bio
                                            }
                                        })
                                    }} color="primary" variant="flat">{t("profile.changeBio")}</Button>
                                    {updateBioError && <Chip color="danger">{updateBioError.message}</Chip>}
                                </CardBody>
                            </Card>
                            <Card className="mt-8 p-6 bg-gray-800">
                                <CardHeader>
                                    <h2 className="text-2xl font-bold">{t("profile.profilePicture")}</h2>
                                </CardHeader>
                                <CardBody className="space-y-4">
                                    <Input label={t("profile.profilePicture")} value={profilePicture} onChange={(e) => setProfilePicture(e.target.value)} />
                                    <Button color="primary" variant="flat" onClick={() => updateProfilePictureMutation({
                                        variables: {
                                            profilePicture
                                        }
                                    }) }>
                                        {t("profile.uploadPicture")}
                                    </Button>
                                    {updateProfilePictureError && <Chip color="danger">{updateProfilePictureError.message}</Chip>}
                                </CardBody>
                            </Card>
                        </Tab>
                    )}
                </Tabs>
            </div>
        </div>
    )
}
