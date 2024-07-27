import { Button, Input, Spacer, Chip } from "@nextui-org/react"
import { useState, useContext } from "react"
import { UserContext } from "../../context/UserContext"
import { NotFound } from "../Miscellaneous/NotFound"
import { useParams } from "react-router-dom"
import { useMutation } from "@apollo/client"
import { RESET_PASSWORD } from "../../utils/Queries"

export const ResetPassword = () => {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const { token } = useParams()
    const [error, setError] = useState("")
    const [resetPassword, {loading}] = useMutation(RESET_PASSWORD, {
        variables: {
            password,
            confirmPassword,
            codeForVerification: token
        },
        onCompleted: () => {
            setPassword("")
            setConfirmPassword("")
            window.location.href = "/"
        },
        onError: (error) => {
            setError(error)
        }
    })
    const user = useContext(UserContext)
    if (user.getUser) return <NotFound />
    return (
        <main className="container mx-auto my-20 p-4 max-w-lg min-h-[100vh]">
            <h1 className="text-4xl font-bold mb-5 text-center">Reset Password</h1>
            <h4 className="text-lg text-center mb-8">
                Enter your new password below.
            </h4>
            <form className="flex flex-col items-center">
                <Input 
                    placeholder="New Password" 
                    type="password" 
                    className="mt-5"
                    autoFocus
                    variant="faded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Input 
                    placeholder="Confirm Password" 
                    type="password" 
                    className="mt-1"
                    variant="faded"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Spacer y={5} />
                <Button isDisabled={!password || !confirmPassword} isLoading={loading} color="primary" onClick={resetPassword}  type="submit" className="w-full" variant="flat">
                    Reset Password
                </Button>
                {error && (
                    <Chip color="danger" className="mt-4" variant="flat">
                        {error.message}
                    </Chip>
                )}
            </form>
        </main>
    )
}