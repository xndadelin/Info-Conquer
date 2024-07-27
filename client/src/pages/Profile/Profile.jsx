import { useParams } from "react-router-dom"
import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { Loading } from "../../components/Miscellaneous/Loading";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";
import { Avatar, Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { NotFound } from "../../components/Miscellaneous/NotFound";
import { useTranslation } from 'react-i18next'
import { getStatusColor } from "../../utils/getStatusColor";
import { CHANGE_PASSWORD, GET_ACTIVITY, UPDATE_EMAIL, UPDATE_PROFILE_PICTURE, UPDATE_USERNAME, UPDATE_BIO, LOGOUT, GET_PROFILE } from "../../utils/Queries";
import { Settings } from "../../components/Settings/Settings";
import { ProfileInfo } from "../../components/Problem/ProfileInfo";


export const Profile = () => {
    const { username } = useParams();
    const { t } = useTranslation()

    const { user: currentUser } = useContext(UserContext)
    const [page, setPage] = useState(1)
    const [error, setError] = useState('')
    const [newUsername, setNewUsername] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [email, setEmail] = useState('')
    const [bio, setBio] = useState('')
    const [logoutMutation] = useMutation(LOGOUT)
    const [errorUsername, setErrorUsername] = useState('')
    const [errorEmail, setErrorEmail] = useState('')
    const [currentpass, setCurrentPass] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorPassword, setErrorPassword] = useState('')
    const [pageActivity, setPageActivity] = useState(1)
    const [profilePicture, setProfilePicture] = useState('')

    const { data: dataActivity, loading: loadingActivity } = useQuery(GET_ACTIVITY, {
        variables: {
            username
        }
    })
    const { data, loading } = useQuery(GET_PROFILE, {
        variables: {
            username
        },
        onError: (error) => {
            setError(error)
        }
    })

    const [changeUsername, { loading: changeUsernameLoading }] = useMutation(UPDATE_USERNAME, {
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
    const [changeEmail, { loading: changeEmailLoading }] = useMutation(UPDATE_EMAIL, {
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
    const [changePassword, { loading: changePasswordLoading }] = useMutation(CHANGE_PASSWORD, {
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

    const [updateProfilePictureMutation, { error: updateProfilePictureError }] = useMutation(UPDATE_PROFILE_PICTURE, {
        onCompleted: () => {
            window.location.reload()
        }
    })

    const [updateBioMutation, { loading: updateBioLoading, error: updateBioError }] = useMutation(UPDATE_BIO, {
        onCompleted: () => {
            window.location.reload()
        }
    })

    if (loading || loadingActivity) return <Loading />
    if (!data || error) return <NotFound />
    const seeSettings = currentUser && currentUser.getUser && currentUser.getUser.username === username
    
    return (
        <main className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                <Card className="mb-8 bg-gray-800">
                    <CardBody className="flex flex-col md:flex-row md:items-start items-center gap-6 p-6">
                        <section>
                            <Avatar
                                className="w-32 h-32 md:w-48 md:h-48"
                                src={data.getProfile.profilePicture}
                            />
                        </section>
                        <section className="text-center md:text-left">
                            <h1 className="text-3xl font-bold mb-2">{data.getProfile.username}</h1>
                            <p className="text-xl text-gray-400 mb-4">
                                {data.getProfile.admin ? t("profile.admin") : t("profile.user")}
                            </p>
                            <p className="text-gray-400 mt-2">Created at: {new Date(+data.getProfile.createdAt).toLocaleString()}</p>
                            <p className="text-gray-400 mt-2">{t("profile.bio")}: {data.getProfile.bio}</p>
                            <div className="flex flex-wrap gap-4 mt-4">
                                <Card className="bg-primary p-4 flex-1 min-w-[120px]">
                                    <p className="text-2xl font-bold">{data.getProfile.solvedProblems.length}</p>
                                    <p className="text-sm text-gray-300">{t("profile.problemsSolved")}</p>
                                </Card>

                                <Card className="bg-secondary p-4 flex-1 min-w-[120px]">
                                    <p className="text-2xl font-bold">{data.getProfile.solutions.length}</p>
                                    <p className="text-sm text-gray-300">{t("profile.totalSubmissions")}</p>
                                </Card>

                                <Card className="bg-success p-4 flex-1 min-w-[120px]">
                                    <p className="text-2xl font-bold">
                                        {data.getProfile.solutions.filter(s => s.status === "Accepted").length}
                                    </p>
                                    <p className="text-sm text-gray-300">{t("profile.acceptedSolutions")}</p>
                                </Card>
                            </div>
                        </section>
                    </CardBody>
                </Card>

                <Tabs className="mb-8" color="primary">
                    <Tab key="general" title={t("profile.generalInformation")}>
                        <ProfileInfo t={t} data={data} page={page} setPage={setPage} getStatusColor={getStatusColor} dataActivity={dataActivity} setPageActivity={setPageActivity} pageActivity={pageActivity} />
                    </Tab>

                    {seeSettings && (
                        <Tab key="settings" title={t("profile.settings")}>
                            <Settings
                                t={t}
                                data={data}
                                email={email}
                                setEmail={setEmail}
                                newEmail={newEmail}
                                setNewEmail={setNewEmail}
                                changeEmail={changeEmail}
                                changeEmailLoading={changeEmailLoading}
                                errorEmail={errorEmail}
                                currentpass={currentpass}
                                setCurrentPass={setCurrentPass}
                                password={password}
                                setPassword={setPassword}
                                confirmPassword={confirmPassword}
                                setConfirmPassword={setConfirmPassword}
                                changePassword={changePassword}
                                changePasswordLoading={changePasswordLoading}
                                errorPassword={errorPassword}
                                newUsername={newUsername}
                                setNewUsername={setNewUsername}
                                changeUsername={changeUsername}
                                changeUsernameLoading={changeUsernameLoading}
                                errorUsername={errorUsername}
                                bio={bio}
                                setBio={setBio}
                                updateBioMutation={updateBioMutation}
                                updateBioLoading={updateBioLoading}
                                updateBioError={updateBioError}
                                updateProfilePictureMutation={updateProfilePictureMutation}
                                updateProfilePictureError={updateProfilePictureError}
                                setProfilePicture={setProfilePicture}
                                profilePicture={profilePicture}
                            />
                        </Tab>
                    )}
                </Tabs>
            </div>
        </main>
    )
}
