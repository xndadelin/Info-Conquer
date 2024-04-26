import {Modal, Divider,  ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
import { useState } from "react";
import { useMutation, useQuery, gql  } from "@apollo/client";
import { Error } from "./Error";
export const Authenticate = () => {
    const loginDisclosue = useDisclosure();
    const registerDisclosure = useDisclosure();
    
    const [query, setQuery] = useState('');
    const [username, setUsername] = useState(localStorage.getItem('username') || '')
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('')
    const [remember, setRemember] = useState(localStorage.getItem('username') ? true : false)
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
    const RegisterMutation = gql`
        mutation Register($username: String!, $email: String!, $password: String!) {
            register(registerInput: {username: $username, password: $password, email: $email}){
                success
                    error {
                        code
                        message
                    }
            }
        }
    `
    const [loginMutation] = useMutation(LoginMutation, {
        onError: (error) => {
          setError(error.message)
        },
        onCompleted: () => {
            loginDisclosue.onClose()
            localStorage.setItem('username', query)
            setRemember(true)
            !remember && localStorage.removeItem('username')
            window.location.reload()
        }
    });
    const [registerMutation] = useMutation(RegisterMutation, {
        onError: (error) => {
            setError(error.message)
          },
          onCompleted: () => {
              registerDisclosure.onClose()
              window.location.reload()
          }
    })
    const handleRegister = async(e) => {
        e.preventDefault()
        try{
            await registerMutation({
                variables: {
                    password: password,
                    username: username,
                    email: email
                }
            })
        }catch(error){
            console.error(error.message)
        }
    }  
    const handleLogin = async(e) => {
        e.preventDefault()
        try{
            await loginMutation({
                variables: {
                    query: query,
                    password: password
                }
            })
        }catch(error){
            console.error(error.message);
        }
    }
    return (
        <>
            <Button variant="flat" onClick={loginDisclosue.onOpen}>Authenticate</Button>
            <Modal
                className=""
                isOpen={loginDisclosue.isOpen}
                onOpenChange={loginDisclosue.onOpenChange}
                placement="center"
            >
                <ModalContent>
                    {(onClose) => (
                    <>
                        <ModalHeader className="mx-auto">
                            Welcome to <strong>&nbsp;InfoConquer</strong>
                        </ModalHeader>
                        <ModalBody>
                            <Input onChange={(e) => setQuery(e.target.value)} value={query} label="Email or username" variant="flat"/>
                            <Input type="password" onChange={(e) => setPassword(e.target.value)} value={password} label="Password" variant="flat"/>
                            <div className="flex justify-between">
                                <Checkbox isSelected={remember} onValueChange={() => setRemember(true)}>Remember me</Checkbox>
                                <Link href="#">Forgot password?</Link>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <div className="flex w-full flex-col justify-end gap-1">
                                <div className="flex w-full justify-end gap-1">
                                    <Button disabled={!query || !password} onClick={(e) => handleLogin(e)} variant="flat" color="success">Login</Button>
                                    <Button color="danger" variant="flat" onClick={() => {onClose(); setError('')}}>
                                        Close
                                    </Button>
                                </div>
                                <Divider className="mt-2 mb-2"/>
                                <div className="flex w-full gap-1">
                                    Do not have an account? <Link href="#" onClick={() => {registerDisclosure.onOpen(); onClose()}}>Register!</Link>
                                </div>
                                {error && (
                                    <Error error={error}/>
                                )}
                            </div>
                        </ModalFooter>
                    </>
                    )}
                </ModalContent>
            </Modal>
            <Modal
                isOpen={registerDisclosure.isOpen}
                onOpenChange={registerDisclosure.onOpenChange}
                placement="center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                Register a new account
                            </ModalHeader>
                            <ModalBody>
                                <Input onChange={(e) => setEmail(e.target.value)} value={email} description="We'll never share your email with anyone else." label="Email" variant="flat"/>
                                <Input onChange={(e) => setUsername(e.target.value)} value={username} label="Username" variant="flat"/>
                                <Input onChange={(e) => setPassword(e.target.value)} value={password} type="password" label="Password" variant="flat"/>
                                <Input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} type="password" label="Confirm password" variant="flat"/>
                            </ModalBody>
                            <ModalFooter className="flex flex-col">
                                <div className="flex gap-1 self-end">
                                    <Button onClick={(e) => handleRegister(e)} disabled={!email || !username || !password || !confirmPassword || !(password === confirmPassword)} variant="flat" color="success">Register</Button>
                                    <Button onClick={() => {onClose(); setError('')}} variant="flat" color="danger">Close</Button>
                                </div>
                                <Divider/>
                                {error && (
                                    <Error error={error}/>
                                )}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}