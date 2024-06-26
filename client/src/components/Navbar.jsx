import { Navbar, NavbarBrand, DropdownItem, DropdownTrigger, DropdownMenu, Avatar, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Button, Dropdown } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import { useState, useContext } from "react";
import { useMutation, gql } from "@apollo/client";
import { useTranslation } from 'react-i18next';
import { UserContext } from "../context/UserContext";
import { SearchBar } from "./SearchBar";

const logoutMutationQuery = gql`
mutation {
    logout {
        success
    }
}
`;

export const NavigationBar = () => {
    const { t } = useTranslation();
    const { user } = useContext(UserContext);
    const [isOpen, setIsOpen] = useState();
    const [logoutMutation] = useMutation(logoutMutationQuery);

    const handleLogout = async (e) => {
        await logoutMutation();
        window.location.reload();
    };

    return (
        <Navbar isBlurred className="bg-transparent" isMenuOpen={isOpen} onMenuOpenChange={setIsOpen}>
            <NavbarContent>
                <NavbarMenuToggle className="sm:hidden" />
                <NavbarBrand>
                    <Link href="/" color="foreground" size="lg">
                        {t('navbar.brand')}
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link isBlock color="foreground" href="/contests">{t('navbar.contests')}</Link>
                </NavbarItem>
                <NavbarItem>
                    <Link isBlock color="danger" href="/problems">{t('navbar.problems')}</Link>
                </NavbarItem>
                <NavbarItem>
                    <Link isBlock color="foreground" href="/leaderboard">{t('navbar.leaderboard')}</Link>
                </NavbarItem>
                <NavbarItem>
                    <SearchBar />
                </NavbarItem>
            </NavbarContent>
            {!user || !user.getUser ? (
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Button type="button" as={Link} href="/login" variant="flat" color="danger">{t('navbar.login')}</Button>
                    </NavbarItem>
                </NavbarContent>
            ) :
                <NavbarContent justify="end">
                    <Dropdown>
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                size="sm"
                            />
                        </DropdownTrigger>
                        <DropdownMenu variant="flat">
                            <DropdownItem>
                                <div className="font-bold">
                                    {t('navbar.signedInAs')}{user.getUser && user.getUser.username}
                                </div>
                            </DropdownItem>
                            <DropdownItem as={Link} href={`/profile/${user.getUser.username}`} color="danger" className="text-gray-500" size="lg">
                                {t('navbar.profile')}
                            </DropdownItem>
                            {user.getUser.admin && (
                                <DropdownItem as={Link} className="text-gray-500" href="/problems/publish" color="danger">
                                    {t('navbar.publishProblem')}
                                </DropdownItem>
                            )}
                            {user.getUser.admin && (
                                <DropdownItem className="text-gray-500" as={Link} href="/articles/publish" color="danger">
                                    {t('navbar.publishArticle')}
                                </DropdownItem>
                            )}
                            {user.getUser.admin && (
                                <DropdownItem as={Link} className="text-gray-500" href="/post-announcement" color="danger">
                                    {t('navbar.postAnnouncement')}
                                </DropdownItem>
                            )}
                            {user.getUser.admin && (
                                <DropdownItem as={Link} className="text-gray-500" href="/contests/create" color="danger">
                                    {t('navbar.createContest')}
                                </DropdownItem>
                            )}
                            <DropdownItem onPress={(e) => handleLogout(e)} color="danger">
                                <p className="text-red-500">{t('navbar.logout')}</p>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarContent>
            }
            <NavbarMenu>
                {[
                    { name: t('navbar.contests'), href: "/contests" },
                    { name: t('navbar.about'), href: "/about" },
                    { name: t('navbar.problems'), href: "/problems" },
                    { name: t('navbar.solutions'), href: "/solutions" }
                ].map((item, index) => (
                    <NavbarMenuItem key={index}>
                        <Link href={item.href} color="foreground" isBlock>{item.name}</Link>
                    </NavbarMenuItem>
                ))}
                {user && user.getUser && (
                    <NavbarMenuItem>
                        <Link href={`/profile/${user.getUser.username}`} color="foreground" isBlock>{t('navbar.profileLink')}</Link>
                    </NavbarMenuItem>
                )}
            </NavbarMenu>
        </Navbar>
    );
};
