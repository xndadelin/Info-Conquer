import { Button, Card, CardBody, CardFooter, CardHeader, Checkbox, Chip, Divider, Input } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
const LoginMutation = gql`
mutation Login($query: String!, $password: String!) {
    login(loginInput: { query: $query, password: $password }) {
    success
        error {
            code
            message
        }
    }
}
`
export const Login = () => {
    const [query, setQuery] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const {user} = useContext(UserContext)
    const [loginMutation, {loading} ] = useMutation(LoginMutation, {
        onError: (error) => {
          setError(error.message)
        },
        onCompleted: () => {
            window.location.reload()
        },
        variables: {
            query,
            password
        }
    });
    if(user.getUser) window.location.href = '/'
    return (
        <div className="container mx-auto flex items-center h-[100vh] justify-center">
            <Card className="p-4 w-[450px] m-4 mb-[100px]">
                <CardHeader>
                    <div>
                        <h1 className="text-2xl font-bold">Login</h1>
                        <p className="text-gray-500">Welcome back to InfoConquer!</p>
                    </div>
                </CardHeader>
                <CardBody>
                    <form className="flex flex-col">
                        <div className="mb-4">
                           <Input label="Username or email" onChange={(e) => setQuery(e.target.value)}/>
                        </div>
                        <div className="mb-4">
                            <Input label="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="mb-4 flex justify-between">
                            <Checkbox color="danger">Remember me</Checkbox>
                            <Link href="/forgot-password" color="danger" isBlock>Forgot password?</Link>
                        </div>
                        <Button onClick={(e) => {
                            e.preventDefault()
                            loginMutation()
                        }} isLoading={loading} disabled={!query || !password} className="w-full" type="submit" color="danger" variant="flat">Login</Button>
                        <Divider className="mt-4 mx-auto w-[40px] p-0.5 rounded-lg"/>
                        <Link className="self-center mt-2" href="/register" color="foreground" isBlock>Don't have an account? Register!</Link>
                    </form>
                </CardBody>
                {error && (
                    <CardFooter>
                        <Chip className="whitespace-pre-wrap h-full p-3" color="danger" variant="flat">{error}</Chip>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}