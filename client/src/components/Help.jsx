import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link } from "@nextui-org/react"

export const Help = () => {
    return (
        <div className="fixed bottom-0 right-0 p-5 z-50">
            <Dropdown backdrop="blur" radius="sm" className="p-0">
                <DropdownTrigger>
                    <Button 
                        isIconOnly 
                        className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                        aria-label="Help"
                    >
                        <svg height={25} fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path d="M80 160c0-35.3 28.7-64 64-64h32c35.3 0 64 28.7 64 64v3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74V320c0 17.7 14.3 32 32 32s32-14.3 32-32v-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7V160c0-70.7-57.3-128-128-128H144C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"/>
                        </svg>
                    </Button>
                </DropdownTrigger>
                <DropdownMenu 
                    variant="light" 
                    className="bg-gradient-to-b from-gray-900 to-gray-800 text-white rounded-lg p-5"
                >
                    <DropdownItem>
                        <Link href="/documentation" className="text-white text-lg font-bold flex items-center gap-3 hover:text-pink-400 transition-colors">
                            <svg fill="currentColor" height={22} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/>
                            </svg>
                            Documentation
                        </Link>
                    </DropdownItem>
                    <DropdownItem>
                        <Link href="/privacy-policy" className="text-white text-lg font-bold flex items-center gap-3 hover:text-purple-400 transition-colors">
                            <svg fill="currentColor" height={22} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H392.6c-5.4-9.4-8.6-20.3-8.6-32V352c0-2.1 .1-4.2 .3-6.3c-31-26-71-41.7-114.6-41.7H178.3zM528 240c17.7 0 32 14.3 32 32v48H496V272c0-17.7 14.3-32 32-32zm-80 32v48c-17.7 0-32 14.3-32 32V480c0 17.7 14.3 32 32 32H608c17.7 0 32-14.3 32-32V352c0-17.7-14.3-32-32-32V272c0-44.2-35.8-80-80-80s-80 35.8-80 80z"/>
                            </svg>
                            Privacy Policy
                        </Link>
                    </DropdownItem>
                    <DropdownItem>
                        <Link href="/security-policy" className="text-white text-lg font-bold flex items-center gap-3 hover:text-blue-400 transition-colors">
                            <svg fill="currentColor" height={22} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0z"/>
                            </svg>
                            Security Policy
                        </Link>
                    </DropdownItem>
                    <DropdownItem>
                        <div className="flex gap-3 justify-center">
                            <Button 
                                color="default" 
                                onClick={() => {localStorage.setItem('language', 'ro'); window.location.reload()}} 
                                className="text-2xl flex-1 hover:bg-gray-700 transition-colors" 
                                variant="flat"
                            > 
                                🇷🇴
                            </Button>
                            <Button 
                                color="default" 
                                onClick={() => {localStorage.setItem('language', 'en'); window.location.reload()}} 
                                className="text-2xl flex-1 hover:bg-gray-700 transition-colors" 
                                variant="flat"
                            >
                                🇬🇧
                            </Button>
                        </div>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    )
}