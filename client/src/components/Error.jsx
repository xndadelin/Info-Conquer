import {Card, CardBody} from "@nextui-org/react";
export const Error = ({error}) => {
    return (
        <Card className="w-full">
            <CardBody className="flex justify-between text-red-500">
                <pre style={{whiteSpace: 'break-spaces'}}>
                    {error}
                </pre>
            </CardBody>
        </Card>
    )
}