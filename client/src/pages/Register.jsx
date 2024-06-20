import { Button, Card, CardBody, CardFooter, CardHeader, Checkbox, Chip, Divider, Input } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import { useState, useRef } from "react";
import { gql, useMutation } from "@apollo/client";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { useTurnstile } from "../hooks/useTurnstile";
const RegisterMutation = gql`
mutation Register($username: String!, $email: String!, $password: String!, $confirmPassword: String!, $token: String!) {
    register(registerInput: {username: $username, password: $password, email: $email, confirmPassword: $confirmPassword, token: $token}) {
        success
            error {
                code
                message
            }
    }
}
`
export const Register = () => {
    const [username, setUsername] = useState("")
    const [emailSent, setEmailSent] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const turnstileRef = useRef(null);
    const [error, setError] = useState("")
    const {user} = useContext(UserContext)
    const [registerMutation, {loading}] = useMutation(RegisterMutation, {
        onError: (error) => {
            setError(error.message)
            resetTurnstile()
          },
          onCompleted: (data) => {
              if(data.register.success)
                setEmailSent(true)
          },
          variables: {
            username,
            email,
            password,
            confirmPassword
          }
    })
    useTurnstile();
    const handleRegister = (e) => {
        e.preventDefault()
        setError("")
        setEmailSent(false)
        const formData = new FormData(e.target)
        const token = formData.get('cf-turnstile-response')
        registerMutation({
            variables: {
                username,
                email,
                password,
                confirmPassword,
                token
            }
        })
    }
    const resetTurnstile = () => {
        if(window.turnstile) {
            window.turnstile.reset(turnstileRef.current)
        }
    }
    if(user.getUser) window.location.href = '/'
    return (
        <div className="container mx-auto flex items-center h-[100vh] justify-center">
            <Card className="p-4 w-[450px] m-4 mb-[100px]">
                <CardHeader>
                    <div>
                        <h1 className="text-2xl font-bold">Register</h1>
                        <p className="text-gray-500">
                            Welcome to InfoConquer! Register to get started.
                        </p>
                    </div>
                </CardHeader>
                <CardBody>
                    <form onSubmit={(e) => handleRegister(e)}  className="flex flex-col">
                        <div className="mb-4">
                           <Input value={username} label="Username" onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        <div className="mb-4">
                            <Input value={email} label="Email" onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <Input label="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <Input label="Confirm password" type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>

                        <div className="mb-4 flex justify-between">
                            <Checkbox color="danger">Remember me</Checkbox>
                            <Link href="/forgot-password" color="danger" isBlock>Forgot password?</Link>
                        </div>
                        <div className="mb-4 self-center cf-turnstile" ref={turnstileRef}  data-sitekey={process.env.REACT_APP_SITE_KEY}></div>
                        <Button isLoading={loading} isDisabled={!username || !confirmPassword || !email || !password} className="w-full" type="submit" color="danger" variant="flat">Register</Button>
                        <Divider className="mt-4 mx-auto w-[40px] p-0.5 rounded-lg"/>
                        <Link className="self-center mt-2" href="/login" color="foreground" isBlock>
                            Already have an account? Login!
                        </Link>
                    </form>
                </CardBody>
                {error && (
                    <CardFooter className="flex items-center justify-center">
                        <Chip className="whitespace-pre-wrap h-full p-3 rounded-md" color="danger" variant="flat">{error}</Chip>
                    </CardFooter>
                )}
                {emailSent && (
                    <CardFooter>
                        <Chip className="whitespace-pre-wrap h-full p-3 rounded-md" color="success" variant="flat">
                            An email has been sent to your email address. Please verify your email address to continue.
                        </Chip>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}