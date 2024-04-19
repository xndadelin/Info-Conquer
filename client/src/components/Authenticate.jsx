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
    const [seePassword, setSeePassword] = useState(false)
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
            localStorage.setItem('username', username)
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
                            <Input endContent={<Button className="mt-auto" variant="light" onClick={() => setSeePassword(!seePassword)}>{seePassword ? <svg fill="white" width={20} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg> : <svg fill="white" width={20} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/></svg>}</Button>} type={seePassword ? 'password' : 'text'} onChange={(e) => setPassword(e.target.value)} value={password} label="Password" variant="flat"/>
                            <div className="flex justify-between">
                                <Checkbox isSelected={remember} onValueChange={setRemember}>Remember me</Checkbox>
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