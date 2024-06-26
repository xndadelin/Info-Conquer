import { Button, Card, CardBody, CardFooter, CardHeader, Checkbox, Chip, Divider, Input } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import { useState, useRef, useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import { UserContext } from "../context/UserContext";
import { useTurnstile } from "../hooks/useTurnstile";
import { useNavigate } from "react-router-dom";
import { NotFound } from "./NotFound";
import { Discord } from "../utils/Discord";
import { useTranslation } from 'react-i18next';

const LoginMutation = gql`
mutation Login($query: String!, $password: String!, $token: String!) {
    login(loginInput: { query: $query, password: $password, token: $token }) {
        success
        error {
            code
            message
        }
    }
}
`;

export const Login = () => {
    const { t } = useTranslation(); 
    const [query, setQuery] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const turnstileRef = useRef(null);
    useTurnstile();
    const [loginMutation, { loading }] = useMutation(LoginMutation, {
        onError: (error) => {
            setError(error.message);
            resetTurnstile();
        },
        onCompleted: () => {
            navigate(-1);
            window.location.href = '/';
        }
    });

    const handleLogin = (e) => {
        setError("");
        e.preventDefault();
        const formData = new FormData(e.target);
        const token = formData.get('cf-turnstile-response');
        loginMutation({
            variables: {
                query,
                password,
                token
            }
        });
    };

    const resetTurnstile = () => {
        if (window.turnstile) {
            window.turnstile.reset(turnstileRef.current);
        }
    };

    if (user && user.getUser) return <NotFound />;
    return (
        <div className="container mx-auto flex items-center h-[100vh] justify-center">
            <Card className="p-4 w-[450px] m-4 mb-[100px]">
                <CardHeader>
                    <div>
                        <h1 className="text-2xl font-bold">{t('login.header')}</h1>
                        <p className="text-gray-500">{t('login.welcome')}</p>
                    </div>
                </CardHeader>
                <CardBody>
                    <form onSubmit={(e) => handleLogin(e)} className="flex flex-col">
                        <div className="mb-4">
                            <Input 
                                variant="faded" 
                                label={t('login.usernameOrEmail')} 
                                onChange={(e) => setQuery(e.target.value)} 
                            />
                        </div>
                        <div className="mb-4">
                            <Input 
                                variant="faded" 
                                label={t('login.password')} 
                                type="password" 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </div>
                        <div className="mb-4 flex justify-between">
                            <Checkbox color="danger">{t('login.rememberMe')}</Checkbox>
                            <Link href="/forgot-password" color="danger" isBlock>{t('login.forgotPassword')}</Link>
                        </div>
                        <div className="mb-4 self-center cf-turnstile" ref={turnstileRef} data-sitekey={process.env.REACT_APP_SITE_KEY}>
                        </div>
                        <Button 
                            isLoading={loading} 
                            isDisabled={!query || !password} 
                            className="w-full" 
                            type="submit" 
                            color="danger" 
                            variant="flat"
                        >
                            {t('login.loginButton')}
                        </Button>
                        <Divider className="mt-4 mx-auto w-[40px] p-0.5 rounded-lg" />
                        <Link 
                            className="self-center mt-2 flex gap-2 bg-[#5865F2] rounded-md p-2" 
                            href={`${process.env.REACT_APP_DISCORD_REDIRECT}`} 
                            color="foreground"
                        >
                            <Discord className="w-6 h-6 mr-2 inline-block" />
                            {t('login.loginWithDiscord')}
                        </Link>
                        <Link className="self-center mt-2" href="/register" color="foreground" isBlock>{t('login.register')}</Link>
                    </form>
                </CardBody>
                
                {error && (
                    <CardFooter>
                        <Chip className="whitespace-pre-wrap h-full p-3 rounded-lg" color="danger" variant="flat">
                            {error}
                        </Chip>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
};
