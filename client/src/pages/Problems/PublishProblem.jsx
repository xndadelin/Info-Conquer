import { useState, useContext } from "react";
import { Button, Checkbox, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { Textarea, Select, SelectItem, Chip } from "@nextui-org/react";
import { useMutation } from "@apollo/client";
import { UserContext } from "../../context/UserContext";
import { NotFound } from "../../components/Miscellaneous/NotFound";
import { DropFile } from "../../components/Problem/DropFile";
import { problems } from "./ProblemsSelection";
import { CREATE_PROBLEM } from "../../utils/Queries";

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
);

const MinusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export const PublishProblem = () => {
    const { user } = useContext(UserContext)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const difficulties = [{ value: 'Easy' }, { value: 'Medium' }, { value: 'Hard' }, { value: 'Challenging' }, { value: 'Expert' }];
    const [title, setTitle] = useState('')
    const [requirement, setRequirements] = useState('')
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState([])
    const [tag, setTag] = useState('')
    const [difficulty, setDifficulty] = useState('')
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [restriction, setRestriction] = useState('')
    const [timeExecution, setTimeExecution] = useState(0)
    const [limitMemory, setLimitMemory] = useState(0)
    const [numberExamples, setNumberExamples] = useState(0);
    const [examples, setExamples] = useState([]);
    const [tests, setTests] = useState([])
    const [category, setCategory] = useState('')
    const [subcategories, setSubcategories] = useState([])
    const [indications, setIndications] = useState('')
    const [error, setError] = useState('')
    const [languages, setLanguages] = useState([])
    const [itsForContest, setItsForContest] = useState(false)

    const [createProblem] = useMutation(CREATE_PROBLEM, {
        onError: (error) => {
            setError(error)
        },
        onCompleted: () => {
            onClose()
            window.location.reload()
        }
    })
    const handleCreateProblem = () => {
        createProblem({
            variables: {
                title,
                requirements: requirement,
                description,
                tags,
                difficulty,
                input,
                output,
                restriction,
                timeExecution,
                limitMemory,
                examples,
                tests,
                category,
                subcategories,
                indications,
                languages,
                itsForContest,
            }
        })
    }

    const onAddTag = () => {
        if (!tags.includes(tag)) {
            setTags([...tags, tag])
        }
        setTag('')
    }

    const onAddDelete = (tagName) => {
        setTags(tags.filter((tag) => tag !== tagName))
    }

    const handleInputExample = (index, value) => {
        setExamples(prev => {
            const updatedExamples = [...prev]
            updatedExamples[index].input = value;
            return updatedExamples
        })
    }

    const handleExampleExplanation = (index, value) => {
        setExamples(prev => {
            const updatedExamples = [...prev]
            updatedExamples[index].explanation = value;
            return updatedExamples
        })
    }

    const handleOutputExample = (index, value) => {
        setExamples(prev => {
            const updatedExamples = [...prev]
            updatedExamples[index].output = value;
            return updatedExamples
        })
    }

    const addExample = () => {
        setNumberExamples(prev => prev + 1)
        setExamples(prev => [
            ...prev, {
                input: '',
                output: ''
            }
        ])
    }

    const deleteExample = (index) => {
        setExamples(prev => prev.filter((_, i) => i !== index))
        setNumberExamples(prev => prev - 1)
    }

    const handleSubcategoryChange = (subcategory) => {
        const subcategories = subcategory.target.value.split(",")
        setSubcategories(subcategories)
    }

    const Subcategories = (category) => {
        const index = problems.findIndex(problem => problem.category === category)
        if (index !== -1) {
            return (
                <Select isRequired selectionMode="multiple" isMultiline label="Subcategory" renderValue={(subcategories) => {
                    return (
                        <div className="flex flex-wrap gap-3">
                            {subcategories.map((subcategory) => (
                                <Chip key={subcategory.key}>{subcategory.key}</Chip>
                            ))}
                        </div>
                    )
                }} onChange={(e) => handleSubcategoryChange(e)}>
                    {problems[index].subcategories.map((subcategory) => (
                        <SelectItem key={subcategory}>{subcategory}</SelectItem>
                    ))}
                </Select>
            )
        } else {
            return null;
        }
    }
    if (!user.getUser || !user.getUser.admin)
        return <NotFound />
    return (
        <main className="min-h-screen text-gray-100">
            <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold mb-8">Publish a Problem</h1>

                <div className="space-y-6">
                    <div className="bg-gray-700 rounded-lg p-6 shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                isRequired
                                label="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <Select
                                label="Difficulty"
                                isRequired
                                items={difficulties}
                                onChange={(e) => setDifficulty(e.target.value)}
                            >
                                {(difficulty) => <SelectItem key={difficulty.value}>{difficulty.value}</SelectItem>}
                            </Select>
                        </div>
                        <Textarea
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-4 "
                        />
                        <Textarea
                            isRequired
                            label="Requirements"
                            value={requirement}
                            onChange={(e) => setRequirements(e.target.value)}
                            className="mt-4 "
                        />
                    </div>

                    <div className="bg-gray-700 rounded-lg p-6 shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4 0">Tags and Categories</h2>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Input
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                                label="Add Tag"
                                className="flex-grow "
                            />
                            <Button
                                disabled={tag === ''}
                                color="primary"
                                onClick={onAddTag}
                                auto
                            >
                                <PlusIcon /> Add Tag
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {tags.map((tag) => (
                                <Chip
                                    key={tag}
                                    onClose={() => onAddDelete(tag)}
                                    variant="flat"
                                    color="primary"
                                >
                                    {tag}
                                </Chip>
                            ))}
                        </div>
                        <Select
                            label="Category"
                            isRequired
                            items={problems}
                            onChange={(e) => setCategory(e.target.value)}
                            className="mb-4"
                        >
                            {(problems) => <SelectItem key={problems.category}>{problems.category}</SelectItem>}
                        </Select>
                        {Subcategories(category)}
                    </div>

                    <div className="bg-gray-700 rounded-lg p-6 shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4 0">Problem Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Textarea label="Input" onChange={(e) => setInput(e.target.value)} value={input} className="" />
                            <Textarea label="Output" onChange={(e) => setOutput(e.target.value)} value={output} className="" />
                        </div>
                        <Textarea label="Restrictions" onChange={(e) => setRestriction(e.target.value)} value={restriction} className="mt-4 " />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <Input type="number" required label="Time limit (in s)" onChange={(e) => setTimeExecution(e.target.value)} className="" />
                            <Input type="number" required label="Memory limit (in MB)" onChange={(e) => setLimitMemory(e.target.value)} className="" />
                        </div>
                        <Checkbox onChange={(e) => setItsForContest(e.target.checked)} className="mt-4">
                            This problem is for a contest
                        </Checkbox>
                    </div>

                    <div className="bg-gray-700 rounded-lg p-6 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold 0">Examples</h2>
                            <Button variant="flat" color="primary" onClick={addExample}>
                                <PlusIcon /> Add Example
                            </Button>
                        </div>
                        {Array.from({ length: numberExamples }, (_, index) => (
                            <div key={index} className=" rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-lg font-semibold">Example {index + 1}</label>
                                    <Button variant="flat" onClick={() => deleteExample(index)} color="danger" auto>
                                        <MinusIcon /> Delete
                                    </Button>
                                </div>
                                <Textarea isRequired type="text" label="Input" onChange={(e) => handleInputExample(index, e.target.value)} className="mb-2" />
                                <Textarea isRequired type="text" label="Output" onChange={(e) => handleOutputExample(index, e.target.value)} className="mb-2" />
                                <Textarea type="text" label="Explanation" onChange={(e) => handleExampleExplanation(index, e.target.value)} />
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-700 rounded-lg p-6 shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4 0">Tests</h2>
                        <DropFile tests={tests} setTests={setTests} />
                    </div>

                    <Button
                        variant="flat"
                        color="success"
                        onClick={onOpen}
                        size="lg"
                        className="w-full"
                    >
                        <CheckIcon /> Publish Problem
                    </Button>
                </div>
            </div>

            <Modal isOpen={isOpen} onOpenChange={onOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>
                        Are you sure you want to publish this problem?
                    </ModalHeader>
                    <ModalBody>
                        Make sure you double check the problem details, have the right test cases and coerency. 🚀
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" color="success" onClick={handleCreateProblem}>Publish</Button>
                        <Button variant="flat" color="primary" onClick={onClose}>Close</Button>
                    </ModalFooter>
                    {error && (
                        <div className="p-4 w-[100%] text-center">
                            <Chip className="p-4 w-full rounded-lg" variant="flat" color="danger">
                                {error.message}
                            </Chip>
                        </div>
                    )}
                </ModalContent>
            </Modal>
        </main>
    )
}