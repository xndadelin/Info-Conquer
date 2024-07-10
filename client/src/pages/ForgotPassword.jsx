import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import { NotFound } from "../components/NotFound"
import { Input, Spacer, Button, Chip } from "@nextui-org/react"
import { useState } from "react"
import { useMutation } from "@apollo/client"
import { FORGOT_PASSWORD } from "../utils/Queries"

export const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [sendEmail, {loading, error, data}] = useMutation(FORGOT_PASSWORD, {
        variables: {
            email
        },
        onCompleted: () => {
            setEmail("")
        },
        onError: (error) => {
            console.log(error)
        }
    })
    const user = useContext(UserContext)
    if (user.getUser) return <NotFound />
    return (
        <main className="container mx-auto my-20 p-4 max-w-lg min-h-[100vh]">
            <h1 className="text-4xl font-bold mb-5 text-center">Forgot Password</h1>
            <h4 className="text-lg text-center mb-8">
                Did you forget your password? No worries! Just enter your email address
                and we will send you a link to reset your password.
            </h4>
            <form className="flex flex-col items-center">
                <Input 
                    placeholder="Email" 
                    type="email" 
                    fullWidth 
                    className="mt-5"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Spacer y={1} />
                <Button isLoading={loading}  isDisabled={!email} color="primary" onClick={sendEmail}  type="submit" className="w-full" variant="flat">
                    Send Reset Link
                </Button>
                {error && (
                    <Chip color="danger" className="mt-4" variant="flat">
                        {error.message}
                    </Chip>
                )}
                {data?.forgotPassword?.success && (
                    <Chip color="success" className="mt-4" variant="flat">
                        Email sent successfully!
                    </Chip>
                )}
            </form>
        </main>
    )
}