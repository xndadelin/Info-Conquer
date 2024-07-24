import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { useTranslation } from 'react-i18next';
import { UserContext } from "../../context/UserContext";
import { NavbarContent as NavbarCont } from "./NavbarContent";
import { AuthDropdown } from "./AuthDropdown";

export const NavigationBar = () => {
    const { t } = useTranslation();
    const { user } = useContext(UserContext);
    const [isOpen, setIsOpen] = useState(false);

    const navbarMenu = [
        { name: t('navbar.contests'), href: "/contests" },
        { name: t('navbar.problems'), href: "/problems" },
        { name: t('navbar.leaderboard'), href: "/leaderboard" },
    ];

    return (
        <nav className="shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden text-white focus:outline-none mr-3"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                        <Link to="/" className="font-bold text-white text-lg">
                            {t('navbar.brand')}
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center justify-center flex-1">
                        <NavbarCont />
                    </div>
                    <div className="flex items-center">
                        {!user || !user.getUser ? (
                            <Link
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                                to="/login"
                            >
                                {t('navbar.login')}
                            </Link>
                        ) : (
                            <AuthDropdown user={user} />
                        )}
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navbarMenu.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className="text-white hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};