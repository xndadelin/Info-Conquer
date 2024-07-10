import { Card, CardBody, Avatar, Input, Button, Textarea, Chip, Divider } from "@nextui-org/react";

export const Settings = ({ t, data, setProfilePicture, profilePicture, updateProfilePictureMutation, updateProfilePictureError, bio, setBio, updateBioMutation, updateBioError, newUsername, setNewUsername, changeUsername, changeUsernameLoading, errorUsername, email, setEmail, newEmail, setNewEmail, changeEmail, changeEmailLoading, errorEmail, currentpass, setCurrentPass, password, setPassword, confirmPassword, setConfirmPassword, changePassword, changePasswordLoading, errorPassword }) => {
    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-center mb-8">{t("profile.settings")}</h1>

            <Card className="bg-gray-800 shadow-lg">
                <CardBody className="p-8">
                    <h2 className="text-2xl font-semibold mb-6">{t("profile.personalInfo")}</h2>

                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-32 w-32 max-md:h-20 max-md:w-20" src={data.getProfile.profilePicture} />
                            <div className="flex-grow">
                                <Input
                                    label={t("profile.profilePicture")}
                                    value={data.getProfile.profilePicture}
                                    onChange={(e) => setProfilePicture(e.target.value)}
                                    className="mb-2"
                                />
                                <Button
                                    color="primary"
                                    size="sm"
                                    onClick={() => updateProfilePictureMutation({ variables: { profilePicture } })}
                                >
                                    {t("profile.uploadPicture")}
                                </Button>
                                {updateProfilePictureError && <Chip color="danger" size="sm" className="mt-2">{updateProfilePictureError.message}</Chip>}
                            </div>
                        </div>

                        <Textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            label={t("profile.writeAboutYourself")}
                            className="min-h-[100px]"
                        />
                        <Button
                            onClick={() => updateBioMutation({ variables: { bio } })}
                            color="primary"
                        >
                            {t("profile.changeBio")}
                        </Button>
                        {updateBioError && <Chip color="danger" size="sm">{updateBioError.message}</Chip>}
                    </div>
                </CardBody>
            </Card>

            <Card className="bg-gray-800 shadow-lg">
                <CardBody className="p-8">
                    <h2 className="text-2xl font-semibold mb-6">{t("profile.accountInfo")}</h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-4">{t("profile.changeUsername")}</h3>
                            <div className="space-y-3">
                                <Input label={t("profile.username")} value={data.getProfile.username} disabled />
                                <Input label={t("profile.newUsername")} onChange={(e) => setNewUsername(e.target.value)} />
                                <Button color="primary" onClick={changeUsername} isLoading={changeUsernameLoading}>
                                    {t("profile.changeUsername")}
                                </Button>
                                {errorUsername && <Chip color="danger" size="sm">{errorUsername}</Chip>}
                            </div>
                        </div>

                        <Divider className="my-6" />

                        <div>
                            <h3 className="text-lg font-medium mb-4">{t("profile.changeEmail")}</h3>
                            <div className="space-y-3">
                                <Input label={t("profile.email")} onChange={(e) => setEmail(e.target.value)} value={email} />
                                <Input label={t("profile.newEmail")} value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                                <Button color="primary" onClick={changeEmail} isLoading={changeEmailLoading}>
                                    {t("profile.changeEmail")}
                                </Button>
                                {errorEmail && <Chip color="danger" size="sm">{errorEmail}</Chip>}
                            </div>
                        </div>

                        <Divider className="my-6" />

                        <div>
                            <h3 className="text-lg font-medium mb-4">{t("profile.changePassword")}</h3>
                            <div className="space-y-3">
                                <Input label={t("profile.currentPassword")} value={currentpass} onChange={(e) => setCurrentPass(e.target.value)} type="password" />
                                <Input label={t("profile.newPassword")} value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
                                <Input label={t("profile.confirmPassword")} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" />
                                <Button color="primary" onClick={changePassword} isLoading={changePasswordLoading}>
                                    {t("profile.changePassword")}
                                </Button>
                                {errorPassword && <Chip color="danger" size="sm">{errorPassword}</Chip>}
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}