import { useContext } from "react"
import { UserContext } from "../context/UserContext"
export const LandingAuth = () => {
    const {user} = useContext(UserContext)
    return (
        <div className="font-bold text-5xl container mx-auto">
            Hello, {user && user.getUser.username}
        </div>
    )
}