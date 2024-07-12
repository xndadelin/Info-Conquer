import { Spinner } from "@nextui-org/react";
export const Loading = () => {
    return (
        <main className="h-screen w-full flex justify-center align-center">
            <Spinner color="default" />
        </main>
    )
}