import { Button, Card, CardBody, CardFooter, CardHeader, Checkbox, Chip, Divider, Input } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
const RegisterMutation = gql`
mutation Register($username: String!, $email: String!, $password: String!, $confirmPassword: String!) {
    register(registerInput: {username: $username, password: $password, email: $email, confirmPassword: $confirmPassword}){
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
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const {user} = useContext(UserContext)
    const [registerMutation, {loading}] = useMutation(RegisterMutation, {
        onError: (error) => {
            setError(error.message)
          },
          onCompleted: () => {
              window.location.reload()
          },
          variables: {
            username,
            email,
            password,
            confirmPassword
          }
    })
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
                    <form className="flex flex-col">
                        <div className="mb-4">
                           <Input label="Username" onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        <div className="mb-4">
                            <Input label="Email" onChange={(e) => setEmail(e.target.value)} />
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
                        <Button onClick={(e) => {
                            e.preventDefault()
                            registerMutation()
                        }} isLoading={loading} disabled={!username || !confirmPassword || !email || !password} className="w-full" type="submit" color="danger" variant="flat">Register</Button>
                        <Divider className="mt-4 mx-auto w-[40px] p-0.5 rounded-lg"/>
                        <Link className="self-center mt-2" href="/login" color="foreground" isBlock>
                            Already have an account? Login!
                        </Link>
                    </form>
                </CardBody>
                {error && (
                    <CardFooter>
                        <Chip className="whitespace-pre-wrap h-full p-3 rounded-md" color="danger" variant="flat">{error}</Chip>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}