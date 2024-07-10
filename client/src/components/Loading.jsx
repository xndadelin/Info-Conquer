import { Spinner } from "@nextui-org/react";
export const Loading = () => {
    return (
        <main className="h-screen w-full flex justify-center align-center text-red-500">
            <Spinner color="default" />
        </main>
    )
}