import {Navbar, NavbarBrand, DropdownItem, DropdownTrigger, DropdownMenu, Avatar,  NavbarContent, NavbarItem,  NavbarMenuToggle,NavbarMenu,NavbarMenuItem, Link, Button, Dropdown} from "@nextui-org/react";
import { useState } from "react";
import { Authenticate } from "./Authenticate";
import { useMutation, useQuery, gql  } from "@apollo/client";
import { Loading } from "./Loading";
const getUser = gql`
    query{
        getUser {
            username,
            createdAt,
            email,
            admin
        }
    }
`
export const NavigationBar = () => {
    const {loading, error, data}  = useQuery(getUser)
    const [isOpen, setIsOpen] = useState(false);
    const logoutMutationQuery = gql`
        mutation {
            logout {
            success
            }
        } 
    `   
    const [logoutMutation] = useMutation(logoutMutationQuery)
    if(loading){
        return (
            <Loading/>
        )
    }
    const handleLogout = async() => {
        await logoutMutation()
        window.location.reload()
    } 
    return (
        <Navbar isBlurred isBordered isMenuOpen={isOpen} onMenuOpenChange={setIsOpen}>
            <NavbarContent>
                <NavbarMenuToggle className="sm:hidden"/>
                <NavbarBrand className="text-2xl">
                    &lt;InfoConquer/&gt;
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link>Home</Link>
                </NavbarItem>
                <NavbarItem>
                    <Link>About</Link>
                </NavbarItem>
                <NavbarItem>
                    <Link>Problems</Link>
                </NavbarItem>
                <NavbarItem>
                    <Link>Solutions</Link>
                </NavbarItem>
            </NavbarContent>
            {!data.getUser ? (
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
                                Signed in as: {data.getUser && data.getUser.username}
                               </div>
                            </DropdownItem>
                            <DropdownItem>
                                    See your profile
                            </DropdownItem>
                            <DropdownItem>
                                    My settings
                            </DropdownItem>
                            <DropdownItem>
                                <Link onClick={handleLogout} color="danger">Logout</Link>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarContent>
            }
            <NavbarMenu>
                <NavbarMenuItem>
                    <Link size="lg" className="w-full">About</Link>
                </NavbarMenuItem>
                <NavbarMenuItem>
                    <Link size="lg">Report a problem</Link>
                </NavbarMenuItem>
            </NavbarMenu>
        </Navbar>
    )
}