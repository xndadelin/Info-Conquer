import {Button} from "@nextui-org/react";
import {useNavigate} from "react-router-dom";
export const NotFound = () => {
    const navigate = useNavigate()
    return (
        <div className="container mx-auto flex gap-2 flex-col items-center justify-center h-screen px-5">
            <div className="grid gap-2">
                <p className="text-5xl">The page you tried to access does not exist.</p>
                <p className="text-default-500">This is an 404 error. It means the page is not found. Please try again with the correct URL!</p>
                <Button className="self-start" onClick={() => navigate(-1)}>Get back!</Button>
            </div>
        </div>
    )
}