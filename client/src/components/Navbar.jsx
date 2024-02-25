import {Navbar, NavbarBrand, DropdownItem, DropdownTrigger, DropdownMenu, Avatar,  NavbarContent, NavbarItem,  NavbarMenuToggle,NavbarMenu,NavbarMenuItem, Button, Dropdown} from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Authenticate } from "./Authenticate";
import { useMutation, useQuery, gql  } from "@apollo/client";
import { Loading } from "./Loading";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
const logoutMutationQuery = gql`
mutation {
    logout {
        success
    }
} 
`  
export const NavigationBar = () => {
    const {user} = useContext(UserContext)
    const [isOpen, setIsOpen] = useState(false); 
    const [logoutMutation] = useMutation(logoutMutationQuery)
    const handleLogout = async() => {
        await logoutMutation()
        window.location.reload()
    } 
    return (
        <Navbar isBlurred isBordered isMenuOpen={isOpen} onMenuOpenChange={setIsOpen}>
            <NavbarContent>
                <NavbarMenuToggle className="sm:hidden"/>
                <NavbarBrand className="text-2xl">
                    <Link to={'/'}>
                        &lt;InfoConquer/&gt;
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link to="/forum">Forum</Link>
                </NavbarItem>
                <NavbarItem>
                    <Link>About</Link>
                </NavbarItem>
                <NavbarItem>
                    <Link to={'/problems'}>Problems</Link>
                </NavbarItem>
                <NavbarItem>
                    <Link>Solutions</Link>
                </NavbarItem>
            </NavbarContent>
            {!user || !user.getUser ? (
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Authenticate/>
                    </NavbarItem>
                </NavbarContent>
            ): 
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
                                Signed in as: {user.getUser && user.getUser.username}
                               </div>
                            </DropdownItem>
                            <DropdownItem>
                                <Link to={`/profile/${user.getUser.username}`}>See your profile</Link>
                            </DropdownItem>
                            <DropdownItem>
                                My settings
                            </DropdownItem>
                            {user.getUser.admin && (
                                <DropdownItem>
                                    <Link to={'/problems/publish'}>Publish a problem</Link>
                                </DropdownItem>
                            )}
                             {user.getUser.admin && (
                                <DropdownItem>
                                   <Link to={'/articles/publish'}>Publish an article</Link>
                                </DropdownItem>
                            )}
                            <DropdownItem>
                                <Link onClick={handleLogout} color="danger">Logout</Link>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarContent>
            }
            <NavbarMenu>
                <NavbarMenuItem>
                    <Link>About</Link>
                </NavbarMenuItem>
                <NavbarMenuItem>
                    <Link>Report a problem</Link>
                </NavbarMenuItem>
            </NavbarMenu>
        </Navbar>
    )
}