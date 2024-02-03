import {Spinner} from "@nextui-org/react";
export const Loading = () => {
    return (
        <div className="h-full w-full flex justify-center align-center text-red-500">
            <Spinner color="default"/>
        </div>
    )
}