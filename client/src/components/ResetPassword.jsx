import { Button, Input, Spacer, Chip } from "@nextui-org/react"
import { useState, useContext } from "react"
import { UserContext } from "../context/UserContext"
import { NotFound } from "../pages/NotFound"
import { useParams } from "react-router-dom"
import { gql, useMutation } from "@apollo/client"
const ResetPasswordMutation = gql`
    mutation ResetPassword($password: String!, $confirmPassword: String!, $codeForVerification: String!) {
        resetPassword(password: $password, confirmPassword: $confirmPassword, codeForVerification: $codeForVerification) {
            success
        }
    }
`
export const ResetPassword = () => {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const { token } = useParams()
    const [resetPassword, {loading, error, data}] = useMutation(ResetPasswordMutation, {
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
            console.log(error)
        }
    })
    const user = useContext(UserContext)
    if (user.getUser) return <NotFound />
    return (
        <div className="container mx-auto my-20 p-4 max-w-lg min-h-[100vh]">
            <p className="text-4xl font-bold mb-5 text-center">Reset Password</p>
            <p className="text-lg text-center mb-8">
                Enter your new password below.
            </p>
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
        </div>
    )
}