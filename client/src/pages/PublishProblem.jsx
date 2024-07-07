import { useState } from "react";
import { Button, Checkbox, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Snippet, useDisclosure } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { Chip } from "@nextui-org/react";
import { useMutation, gql } from "@apollo/client";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { NotFound } from "./NotFound";
import { DropFile } from "../components/DropFile";
// I fucked something here and I cant find it out, reverted back to older version
export const PublishProblem = () => {
    const { user } = useContext(UserContext)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const difficulties = [{ value: 'Easy' }, { value: 'Medium' }, { value: 'Hard' }, { value: 'Challenging' }, { value: 'Expert' }];
    const languagesDef = [
        { value: 'JavaScript' }, { value: 'Python' }, { value: 'Java' }, { value: 'C#' },
        { value: 'C++' }, { value: 'TypeScript' }, { value: 'Rust' }, { value: 'PHP' }, { value: 'C' }
    ];
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
    const problemMutation = gql`
        mutation CreateProblem($title: String, $description: String, $requirements: String, $type: String, $tags: [String], $difficulty: String, $category: String, $subcategories: [String], $input: String, $output: String, $tests: [TestInput], $timeExecution: Float, $limitMemory: Float, $examples: [ExampleInput], $indications: String, $languages: [String], $restriction: String, $itsForContest: Boolean) {
            createProblem(problemInput: {title: $title, description: $description, requirements: $requirements, type: $type, tags: $tags, difficulty: $difficulty, category: $category, subcategories: $subcategories, input: $input, output: $output, tests: $tests, timeExecution: $timeExecution, limitMemory: $limitMemory, examples: $examples, indications: $indications, languages: $languages, restriction: $restriction, itsForContest: $itsForContest}) {
            success
            error {
                message
                code
            }
            }
        }
    `

    const [createProblem] = useMutation(problemMutation, {
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
    const problems = [
        {
            category: 'Array',
            subcategories: [
                'Static Arrays',
                'Dynamic Arrays',
                'Bidimensional Arrays',
                'Subarray ProblemsSelection',
                'Matrix ProblemsSelection',
                'Rotation of Arrays',
                'Sliding Window ProblemsSelection',
                'Two Pointers Technique',
                'Prefix Sum ProblemsSelection',
                'Histogram ProblemsSelection',
                'Array Partitioning',
                'Maximum Subarray ProblemsSelection',
                'Minimum Subarray ProblemsSelection',
                'Sum Pair ProblemsSelection',
                'Search in Arrays',
                'Sorting in Arrays',
                'Sparse Arrays',
                'Bit Arrays',
                'Suffix Arrays'
            ]
        },
        {
            category: 'Linked List',
            subcategories: [
                'Singly Linked Lists',
                'Doubly Linked Lists',
                'Circular Linked Lists',
                'Linked List Operations',
                'Linked List Manipulation',
                'Palindromes in Linked Lists',
                'Intersection and Union of Linked Lists',
                'Merge and Split Linked Lists',
                'Advanced Linked List Techniques',
                'Skip Lists',
                'XOR Linked Lists',
                'Unrolled Linked Lists'
            ]
        },
        {
            category: 'Stack',
            subcategories: [
                'Stack Operations',
                'Stack Implementations',
                'Expression Evaluation',
                'Parentheses Matching',
                'Infix to Postfix Conversion',
                'Evaluation of Postfix Expressions',
                'Special Stacks',
                'Advanced Stack Techniques',
            ]
        },
        {
            category: 'Queue',
            subcategories: [
                'Queue Operations',
                'Queue Implementations',
                'Circular Queues',
                'Priority Queues',
                'Double-ended Queues (Deque)',
                'Queue Applications',
                'BFS (Breadth-First Search) ProblemsSelection',
                'Sliding Window ProblemsSelection using Queues',
                'Advanced Queue Techniques',
            ]
        },
        {
            category: 'Tree',
            subcategories: [
                'Binary Trees',
                'Binary Search Trees (BST)',
                'AVL Trees',
                'Heap (Priority Queue) Trees',
                'Trie (Prefix Tree)',
                'N-ary Trees',
                'Segment Trees',
                'Binary Indexed Trees',
                'Tree Traversal',
                'Level Order Traversal (BFS)',
                'Tree Operations and Manipulation',
                'Tree ProblemsSelection with Recursion',
                'Advanced Tree Techniques',
            ]
        },
        {
            category: 'Graph',
            subcategories: [
                'Graph Representation',
                'Graph Traversal (DFS, BFS)',
                'Shortest Path Algorithms',
                'Minimum Spanning Tree',
                'Topological Sorting',
                'Graph Connectivity',
                'Bipartite Graphs',
                'Eulerian and Hamiltonian Paths',
                'Graph Coloring',
                'Flows and Matching',
                'Network Flow Algorithms',
                'Cycles and Cycle Detection',
                'Graph ProblemsSelection with Recursion',
                'Advanced Graph Techniques',
            ]
        },
        {
            category: 'String',
            subcategories: [
                'String Matching',
                'String Processing',
                'String Compression',
                'String Manipulation',
                'String Searching',
                'String Sorting',
                'String Parsing',
                'String Algorithms',
                'String with Recursion',
                'Advanced String Techniques',
            ]
        },
        {
            category: 'Advanced Data Structures',
            subcategories: [
                'Suffix Array',
                'Suffix Tree',
                'Trie',
                'Segment Tree',
                'Binary Indexed Tree',
                'Fenwick Tree',
                'Disjoint Set',
                'Sparse Table',
                'Wavelet Tree',
                'KD Tree',
                'Quad Tree',
                'Octree',
                'Range Tree',
                'B-Tree',
                'R-Tree',
                'Skip List',
                'Splay Tree',
                'Treap',
                'Tango Tree',
                'Link-Cut Tree',
                'Dancing Links',
                'Scapegoat Tree',
                'Splay Tree',
                'Red-Black Tree',
                'AVL Tree',
            ]
        }

    ]

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

    const handleLanguagesChange = (language) => {
        const languages = language.target.value.split(",")
        setLanguages(languages)
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
        <div className="container mx-auto flex flex-col my-10 gap-3 p-4">
            <p className="font-bold text-5xl mb-4">Publish a problem</p>
            <Input isRequired label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Textarea isRequired label="Requirements" value={requirement} onChange={(e) => setRequirements(e.target.value)} />
            <Input endContent={
                <Button disabled={tag === ''} color="primary" onClick={onAddTag} variant="flat">Add tag</Button>
            } value={tag} onChange={(e) => setTag(e.target.value)} label="Tags" />
            <div className="flex flex-wrap gap-2 text-white">
                {tags.map((tag) => (
                    <Chip onClose={(() => onAddDelete(tag))}>{tag}</Chip>
                ))}
            </div>
            <Select label="Difficulty" isRequired items={difficulties} onChange={(e) => setDifficulty(e.target.value)}>
                {(difficulty) => <SelectItem key={difficulty.value}>{difficulty.value}</SelectItem>}
            </Select>
            <Select label="Category" isRequired items={problems} onChange={(e) => setCategory(e.target.value)}>
                {(problems) => <SelectItem key={problems.category}>{problems.category}</SelectItem>}
            </Select>
            {Subcategories(category)}
            <Select onChange={(e) => handleLanguagesChange(e)} items={languagesDef} label="Languages" isRequired isMultiline selectionMode="multiple" renderValue={(languages) => {
                return (
                    <div className="flex flex-wrap gap-3">
                        {languages.map((language) => (
                            <Chip key={language.key}>{language.key}</Chip>
                        ))}
                    </div>
                )
            }}>
                {(language) => <SelectItem key={language.value}>{language.value}</SelectItem>}
            </Select>
            <Textarea label="Input" onChange={(e) => setInput(e.target.value)} value={input} />
            <Textarea label="Output" onChange={(e) => setOutput(e.target.value)} value={output} />
            <Textarea label="Restrictions" onChange={(e) => setRestriction(e.target.value)} value={restriction} />
            <Input type="number" required label="Time limit (in s)" onChange={(e) => setTimeExecution(e.target.value)} />
            <Input type="number" required label="Memory limit (in MB)" onChange={(e) => setLimitMemory(e.target.value)} />
            <Checkbox onChange={(e) => setItsForContest(e.target.checked)}>
                This problem is for a contest
            </Checkbox>
            <div className="flex justify-between font-bold text-3xl">
                <p>Examples</p>
                <Button variant="bordered" onClick={addExample}>Add example</Button>
            </div>
            {Array.from({ length: numberExamples }, (_, index) => (
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                        <label>Example {index + 1}</label>
                        <Button variant="flat" onClick={() => deleteExample(index)} color="primary">Delete example</Button>
                    </div>
                    <Textarea isRequired type="text" label="Input" onChange={(e) => handleInputExample(index, e.target.value)} />
                    <Textarea isRequired type="text" label="Output" onChange={(e) => handleOutputExample(index, e.target.value)} />
                    <Textarea type="text" label="Explanation" onChange={(e) => handleExampleExplanation(index, e.target.value)} />
                </div>
            ))}
            <Divider />
            <p className="text-3xl font-bold">Tests</p>
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
            <DropFile tests={tests} setTests={setTests} />
            <Button variant="flat" color="primary" onClick={onOpen}>Publish problem</Button>
        </div>
    )
}