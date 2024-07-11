import { NavbarContent, Dropdown, DropdownTrigger, Avatar, DropdownMenu, DropdownItem, Link } from "@nextui-org/react";
import { AdminDropdown } from "./AdminDropdownContent";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";
import { LOGOUT } from "../../utils/Queries";


export const AuthDropdown = ({ user }) => {

    const [logoutMutation] = useMutation(LOGOUT);

    const handleLogout = async () => {
        await logoutMutation();
        window.location.reload();
    };

    const { t } = useTranslation()

    return (
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
                        <AdminDropdown />
                    }
                    <DropdownItem onPress={handleLogout} className="text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                        {t('navbar.logout')}
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </NavbarContent>
    )
}