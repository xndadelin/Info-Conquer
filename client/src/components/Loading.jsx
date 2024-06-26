import { Spinner } from "@nextui-org/react";
export const Loading = () => {
    return (
        <div className="h-screen w-full flex justify-center align-center text-red-500">
            <Spinner color="default" />
        </div>
    )
}