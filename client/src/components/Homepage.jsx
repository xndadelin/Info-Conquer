import {useQuery, gql} from "@apollo/client";
import {Avatar, Card, CardBody, CardHeader, Listbox, ListboxItem} from "@nextui-org/react";
import {Link} from "react-router-dom";
export const Homepage = () => {

    return (
        <div className="container mx-auto py-10 px-5">
            <p className="text-5xl font-bold mb-3">Welcome to InfoConquer!</p>
            <p className="text-default-500 mb-16">What would you like to do today?</p>
            <div className="grid gap-5 lg:grid-cols-3 sm:grid-cols-1">
                <Card className="p-5">
                    <CardHeader className="text-3xl font-bold">👾 Check the latest problems!</CardHeader>
                    <CardBody>
                        <Listbox>
                            <ListboxItem>
                                <Link to={`/problems/MergeSort`}>MergeSort</Link>
                            </ListboxItem>
                            <ListboxItem>MergeSort</ListboxItem>
                            <ListboxItem>MergeSort</ListboxItem>
                            <ListboxItem>MergeSort</ListboxItem>
                        </Listbox>
                    </CardBody>
                </Card>
                <Card className="p-5">
                    <CardHeader className="text-3xl font-bold">🗣 Catch up on the newest discussions!</CardHeader>
                    <CardBody>
                        <Listbox>
                            <ListboxItem>
                                <Link to={`/problems/MergeSort`}>MergeSort</Link>
                            </ListboxItem>
                            <ListboxItem>Why doesnt this work?</ListboxItem>
                            <ListboxItem>Sieve optimization</ListboxItem>
                            <ListboxItem>Why does this work?</ListboxItem>
                        </Listbox>
                    </CardBody>
                </Card>
                <Card className="p-5">
                    <CardHeader className="text-3xl font-bold">📚 Make sure to take a look in these new
                        articles!</CardHeader>
                    <CardBody>
                        <Listbox>
                            <ListboxItem>
                                <Link to={`/problems/MergeSort`}>MergeSort</Link>
                            </ListboxItem>
                            <ListboxItem>MergeSort</ListboxItem>
                            <ListboxItem>Quick Sort</ListboxItem>
                            <ListboxItem>Caesar Cypher</ListboxItem>
                        </Listbox>
                    </CardBody>
                </Card>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
                <div>
                    <p className="text-4xl mt-4 font-bold">🔝 Leaderboard</p>
                    <Card className="mt-5">
                        <CardHeader>* This leaderboard is based on the number of problems solved</CardHeader>
                        <CardBody>
                            <Listbox>
                                <ListboxItem>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Avatar></Avatar>
                                            <p>Adi</p>
                                        </div>
                                        <div>69 problems</div>
                                    </div>
                                </ListboxItem>
                            </Listbox>
                        </CardBody>
                    </Card>
                </div>
                <div>
                    <p className="text-4xl mt-4 font-bold">🆙 Top problems</p>
                    <Card className="mt-5">
                        <CardHeader>* This leaderboard is based on the number of problems solved</CardHeader>
                        <CardBody>
                            <Listbox>
                                <ListboxItem>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Avatar></Avatar>
                                            <p>Adi</p>
                                        </div>
                                        <div>69 problems</div>
                                    </div>
                                </ListboxItem>
                            </Listbox>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    )
}