import { Navbar, NavbarBrand, DropdownItem, DropdownTrigger, DropdownMenu, Avatar, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Button, Dropdown } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import { useState, useContext } from "react";
import { useMutation, gql } from "@apollo/client";
import { useTranslation } from 'react-i18next';
import { UserContext } from "../context/UserContext";
import { SearchBar } from "./SearchBar";
import { LOGOUT } from "../utils/Queries";

export const NavigationBar = () => {
    const { t } = useTranslation();
    const { user } = useContext(UserContext);
    const [isOpen, setIsOpen] = useState();
    const [logoutMutation] = useMutation(LOGOUT);

    const isActive = (href) => {
        return window.location.pathname === href;
    }

    const handleLogout = async (e) => {
        await logoutMutation();
        window.location.reload();
    };

    const navbarContent = [
        {
            name: t('navbar.contests'), href: "/contests", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                </svg>
            )
        },
        {
            name: t('navbar.problems'), href: "/problems", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                </svg>
            )
        },
        {
            name: t('navbar.leaderboard'), href: "/leaderboard", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
            )
        },
    ]

    const adminSection = [
        {
            name: t('navbar.publishProblem'), href: "/problems/publish", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                </svg>

            )
        },
        {
            name: t('navbar.publishArticle'), href: "/articles/publish", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>

            )
        },
        {
            name: t('navbar.postAnnouncement'), href: "/post-announcement", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" />
                </svg>

            )
        },
        {
            name: t('navbar.createContest'), href: "/contests/create", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                </svg>

            )
        },
    ]

    const navbarMenu = [
        { name: t('navbar.contests'), href: "/contests" },
        { name: t('navbar.problems'), href: "/problems" },
        { name: t('navbar.leaderboard'), href: "/leaderboard" },
    ]

    return (
        <Navbar isBlurred className="bg-transparent" isMenuOpen={isOpen} onMenuOpenChange={setIsOpen}>
            <NavbarContent>
                <NavbarMenuToggle className="md:hidden text-white" />
                <NavbarBrand>
                    <Link href="/" color="foreground" size="lg" className="font-bold text-white">
                        {t('navbar.brand')}
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden md:flex gap-4" justify="center">
                {navbarContent.map((item) => (
                    <NavbarItem key={item.href}>
                        <Link
                            isBlock
                            color={isActive(item.href) ? "warning" : "foreground"}
                            href={item.href}
                            className={`flex items-center space-x-1 text-white transition-colors ${isActive(item.href) ? "font-extrabold" : ""
                                }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    </NavbarItem>
                ))}
                <NavbarItem>
                    <SearchBar />
                </NavbarItem>
            </NavbarContent>

            {!user || !user.getUser ? (
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Button
                            as={Link}
                            href="/login"
                            variant="flat"
                            color="primary"
                            className="font-semibold"
                        >
                            {t('navbar.login')}
                        </Button>
                    </NavbarItem>
                </NavbarContent>
            ) : (
                <NavbarContent justify="end">
                    <Dropdown className="bg-gray-900">
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                size="sm"
                                src={user.getUser.profilePicture}
                            />
                        </DropdownTrigger>
                        <DropdownMenu variant="flat">
                            <DropdownItem>
                                <div className="font-bold text-gray-700 dark:text-gray-300">
                                    {t('navbar.signedInAs')} {user.getUser.username}
                                </div>
                            </DropdownItem>
                            <DropdownItem as={Link} href={`/profile/${user.getUser.username}`} className="text-blue-600 dark:text-blue-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                                {t('navbar.profile')}
                            </DropdownItem>
                            {user.getUser.admin &&
                                adminSection.map((item) => (
                                    <DropdownItem as={Link} href={item.href} className="text-gray-600 dark:text-gray-400">
                                        <div className="flex items-center space-x-2">
                                            {item.icon}
                                            <span>{item.name}</span>
                                        </div>
                                    </DropdownItem>
                                )
                            )}
                            <DropdownItem onPress={handleLogout} className="text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                </svg>
                                {t('navbar.logout')}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarContent>
            )}
            <NavbarMenu>
                {navbarMenu.map((item) => (
                    <NavbarMenuItem as={Link} href={item.href}>
                        {item.name}
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    );
};
