import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Button } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { useTranslation } from 'react-i18next';
import { UserContext } from "../../context/UserContext";
import { NavbarContent as NavbarCont } from "./NavbarContent";
import { AuthDropdown } from "./AuthDropdown";
export const NavigationBar = () => {
    const { t } = useTranslation();
    const { user } = useContext(UserContext);
    const [isOpen, setIsOpen] = useState();


    const navbarMenu = [
        { name: t('navbar.contests'), href: "/contests" },
        { name: t('navbar.problems'), href: "/problems" },
        { name: t('navbar.leaderboard'), href: "/leaderboard" },
    ]

    return (
        <Navbar isBlurred className="bg-transparent" isMenuOpen={isOpen} onMenuOpenChange={setIsOpen}>
            <NavbarContent justify="start">
                <NavbarMenuToggle className="md:hidden text-white" />
                <NavbarBrand>
                    <Link to="/" color="foreground" size="lg" className="font-bold text-white">
                        {t('navbar.brand')}
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden md:flex" justify="center">
                <NavbarCont />
            </NavbarContent>

            {!user || !user.getUser ? (
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Link 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                            to="/login"
                        >
                        {t('navbar.login')}
                    </Link>
                    </NavbarItem>
                </NavbarContent>
            ) : (
                <AuthDropdown user={user} />
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
