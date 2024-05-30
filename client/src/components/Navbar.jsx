import {Navbar, NavbarBrand, DropdownItem, DropdownTrigger, DropdownMenu, Avatar,  NavbarContent, NavbarItem,  NavbarMenuToggle,NavbarMenu,NavbarMenuItem, Button, Dropdown} from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import { useState } from "react";
import { useMutation, gql  } from "@apollo/client";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { SearchBar } from "./SearchBar";
const logoutMutationQuery = gql`
mutation {
    logout {
        success
    }
} 
`  
export const NavigationBar = () => {
    const {user} = useContext(UserContext);
    const [isOpen, setIsOpen] = useState()  
    const [logoutMutation] = useMutation(logoutMutationQuery);
    const handleLogout = async(e) => {
        await logoutMutation()
        window.location.reload()
    } 
    return (
        <Navbar shouldHideOnScroll isBlurred isBordered isMenuOpen={isOpen} onMenuOpenChange={setIsOpen}>
            <NavbarContent>
                <NavbarMenuToggle className="sm:hidden"/>
                <NavbarBrand>
                    <Link href="/" color="foreground" size="lg">
                        &lt;InfoConquer/&gt;
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link isBlock color="foreground" href="/contests">Contests</Link>
                </NavbarItem>
                <NavbarItem>
                    <Link isBlock color="danger" href="/problems" >Problems</Link>
                </NavbarItem>
                <NavbarItem>
                    <Link isBlock color="foreground" href="/leaderboard">Leaderboard</Link>
                </NavbarItem>
                <NavbarItem>
                    <SearchBar/>
                </NavbarItem>
            </NavbarContent>
            {!user || !user.getUser ? (
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Button type="button" as={Link} href="/login" variant="flat" color="danger">Login</Button>
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
                            <DropdownItem as={Link} href={`/profile/${user.getUser.username}`} color="danger" className="text-gray-500" size="lg">
                              See your profile & settings
                            </DropdownItem>
                            {user.getUser.admin && (
                                <DropdownItem as={Link} className="text-gray-500" href="/problems/publish" color="danger">
                                    Publish a problem                                    
                                </DropdownItem>
                            )}
                             {user.getUser.admin && (
                                <DropdownItem className="text-gray-500" as={Link} href="/articles/publish" color="danger" >
                                    Publish an article
                                </DropdownItem>
                            )}
                            {user.getUser.admin && (
                                <DropdownItem as={Link} className="text-gray-500" href="/post-announcement" color="danger">
                                    Post announcement                                    
                                </DropdownItem>
                            )}
                            {user.getUser.admin && (
                                <DropdownItem as={Link} className="text-gray-500" href="/contests/create" color="danger">
                                     Create a constest                             
                                </DropdownItem>
                            )}
                            <DropdownItem onPress={(e) => handleLogout(e)} color="danger">
                                <p className="text-red-500">Logout</p>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarContent>
            }
            <NavbarMenu>
                {[{name: "Contests", href: "/contests"}, {name: "About", href: "/about"}, {name: "Problems", href: "/problems"}, {name: "Solutions", href: "/solutions"}].map((item, index) => (
                    <NavbarMenuItem key={index}>
                        <Link href={item.href} color="foreground" isBlock>{item.name}</Link>
                    </NavbarMenuItem>
                ))}
                {user && user.getUser && (
                    <NavbarMenuItem>
                        <Link href={`/profile/${user.getUser.username}`} color="foreground" isBlock>Profile</Link>
                    </NavbarMenuItem>
                )}            
            </NavbarMenu>
        </Navbar>
    )
}
