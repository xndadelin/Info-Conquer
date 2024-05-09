import {Navbar, NavbarBrand, DropdownItem, DropdownTrigger, DropdownMenu, Avatar,  NavbarContent, NavbarItem,  NavbarMenuToggle,NavbarMenu,NavbarMenuItem, Button, Dropdown} from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import { useState } from "react";
import { useMutation, gql  } from "@apollo/client";
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
        logoutMutation()
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
                    <Link color="danger" isBlock href="/about" >About</Link>
                </NavbarItem>
                <NavbarItem>
                    <Link isBlock color="foreground" href="/problems" >Problems</Link>
                </NavbarItem>
                <NavbarItem>
                    <Link isBlock color="danger" href="/leaderboard">Leaderboard</Link>
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
                            <DropdownItem>
                                <Link color="foreground" href={`/profile/${user.getUser.username}`}>See your profile & settings</Link>
                            </DropdownItem>
                            {user.getUser.admin && (
                                <DropdownItem>
                                    <Link color="foreground" href={'/problems/publish'}>Publish a problem</Link>
                                </DropdownItem>
                            )}
                             {user.getUser.admin && (
                                <DropdownItem>
                                   <Link color="foreground" href={'/articles/publish'}>Publish an article</Link>
                                </DropdownItem>
                            )}
                            {user.getUser.admin && (
                                <DropdownItem>
                                    <Link color="foreground" href={'/post-announcement'}>Post announcement</Link>
                                </DropdownItem>
                            )}
                            {user.getUser.admin && (
                                <DropdownItem>
                                    <Link color="foreground" href={'/contests/create'}>Create a contest</Link>
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