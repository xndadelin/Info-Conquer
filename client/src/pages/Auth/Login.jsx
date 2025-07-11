import { Button, Card, CardBody, CardFooter, CardHeader, Checkbox, Chip, Divider, Input } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useState, useRef, useContext } from "react";
import { useMutation } from "@apollo/client";
import { UserContext } from "../../context/UserContext";
import { useTurnstile } from "../../hooks/useTurnstile";
import { NotFound } from "../../components/Miscellaneous/NotFound";
import { Discord } from "../../assets/svgs/Discord";
import { useTranslation } from 'react-i18next';
import { LOGIN } from "../../utils/Queries";

export const Login = () => {
    const { t } = useTranslation();
    const [query, setQuery] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { user } = useContext(UserContext);
    const turnstileRef = useRef(null);
    useTurnstile();
    const [loginMutation, { loading }] = useMutation(LOGIN, {
        onError: (error) => {
            setError(error.message);
            resetTurnstile();
        },
        onCompleted: () => {
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
        <main className="container mx-auto flex items-center min-h-[100vh] justify-center">
            <Card className="p-4 w-[450px] m-4 mb-[100px] bg-gray-800">
                <CardHeader>
                    <section>
                        <h1 className="text-2xl font-bold">{t('login.header')}</h1>
                        <p className="text-gray-500">{t('login.welcome')}</p>
                    </section>
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
                            <Checkbox
                                color="primary"
                            >
                                {t('login.rememberMe')}
                            </Checkbox>
                            <Link
                                className="hover:underline"
                                to="/forgot-password"
                                color="primary"
                            >
                                {t('login.forgotPassword')}
                            </Link>
                        </div>
                        <div
                            className="mb-4 self-center cf-turnstile"
                            ref={turnstileRef}
                            data-sitekey={process.env.REACT_APP_SITE_KEY}
                            data-cy="login_widget"
                        >
                        </div>
                        <Button
                            isLoading={loading}
                            isDisabled={!query || !password}
                            className="w-full"
                            type="submit"
                            color="primary"
                            variant="flat"
                        >
                            {t('login.loginButton')}
                        </Button>
                        <Divider className="mt-4 mx-auto w-[40px] p-0.5 rounded-lg" />
                        <Link
                            className="self-center mt-2 flex gap-2 bg-[#5865F2] rounded-md p-2"
                            to={`${process.env.REACT_APP_DISCORD_REDIRECT}`}
                            color="foreground"
                        >
                            <Discord className="w-6 h-6 mr-2 inline-block" />
                            {t('login.loginWithDiscord')}
                        </Link>
                        <Link
                            className="self-center mt-4 hover:underline"
                            to="/register"
                            color="foreground"
                        >
                            {t('login.register')}
                        </Link>
                    </form>
                </CardBody>

                {error && (
                    <CardFooter>
                        <Chip 
                            className="whitespace-pre-wrap h-full p-3 rounded-lg" 
                            color="danger" 
                            variant="flat"
                        >
                            {error}
                        </Chip>
                    </CardFooter>
                )}
            </Card>
        </main>
    );
};
