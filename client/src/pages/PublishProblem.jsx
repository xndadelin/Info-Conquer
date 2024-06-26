import { useState } from "react";
import { Button, Checkbox, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Snippet, useDisclosure } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { Chip } from "@nextui-org/react";
import { useMutation, gql } from "@apollo/client";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { NotFound } from "./NotFound";
import { useTranslation } from "react-i18next";
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
    const [timeExecution, setTimeExecution] = useState('')
    const [limitMemory, setLimitMemory] = useState('')
    const [numberExamples, setNumberExamples] = useState(0);
    const [numberTests, setNumberTests] = useState(0)
    const [examples, setExamples] = useState([]);
    const [tests, setTests] = useState([])
    const [category, setCategory] = useState('')
    const [subcategories, setSubcategories] = useState([])
    const [indications, setIndications] = useState('')
    const [error, setError] = useState('')
    const [languages, setLanguages] = useState([])
    const [itsForContest, setItsForContest] = useState(false)
    const { t } = useTranslation()
    const problemMutation = gql`
        mutation CreateProblem($title: String, $description: String, $requirements: String, $type: String, $tags: [String], $difficulty: String, $category: String, $subcategories: [String], $input: String, $output: String, $tests: [TestInput], $timeExecution: String, $limitMemory: Int, $examples: [ExampleInput], $indications: String, $languages: [String], $inputFile: String, $outputFile: String, $restriction: String, $itsForContest: Boolean) {
            createProblem(problemInput: {title: $title, description: $description, requirements: $requirements, type: $type, tags: $tags, difficulty: $difficulty, category: $category, subcategories: $subcategories, input: $input, output: $output, tests: $tests, timeExecution: $timeExecution, limitMemory: $limitMemory, examples: $examples, indications: $indications, languages: $languages, inputFile: $inputFile, outputFile: $outputFile, restriction: $restriction, itsForContest: $itsForContest}) {
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
                limitMemory: (limitMemory * 1024),
                examples,
                tests,
                category,
                subcategories,
                indications,
                languages,
                itsForContest: itsForContest ? true : false,
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
    const handleInputTest = (index, value) => {
        setTests(prev => {
            const updatedTests = [...prev];
            updatedTests[index].input = value;
            return updatedTests;
        });
    }
    const handleOutputTest = (index, value) => {
        setTests(prev => {
            const updatedTests = [...prev];
            updatedTests[index].output = value;
            return updatedTests;
        });
    }
    const handleScoreTest = (index, value) => {
        setTests(prev => {
            const updatedTests = [...prev];
            updatedTests[index].score = value;
            return updatedTests;
        });
    }
    const addTest = () => {
        setNumberTests((prev) => prev + 1)
        setTests((tests) => [
            ...tests, {
                input: '',
                output: '',
                score: ''
            }
        ])
    }
    const deleteTest = (index) => {
        ;
        setTests(prev => prev.filter((_, i) => i !== index));
        setNumberTests(prev => prev - 1);
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
            <p className="font-bold text-5xl mb-4">{t('publishProblem.title')}</p>
            <Input isRequired label={t('publishProblem.title')} value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea label={t('publishProblem.description')} value={description} onChange={(e) => setDescription(e.target.value)} />
            <Textarea isRequired label={t('publishProblem.requirements')} value={requirement} onChange={(e) => setRequirements(e.target.value)} />
            <Input endContent={
                <Button disabled={tag === ''} color="danger" onClick={onAddTag} variant="flat">{t('publishProblem.addTag')}</Button>
            } value={tag} onChange={(e) => setTag(e.target.value)} label={t('publishProblem.tags')} />
            <div className="flex flex-wrap gap-2 text-white">
                {tags.map((tag, index) => (
                    <Chip key={index} onClose={() => onAddDelete(tag)}>{tag}</Chip>
                ))}
            </div>
            <Select label={t('publishProblem.difficulty')} isRequired items={difficulties} onChange={(e) => setDifficulty(e.target.value)}>
                {difficulties.map((difficulty, index) => (
                    <SelectItem key={index}>{difficulty}</SelectItem>
                ))}
            </Select>
            <Select label={t('publishProblem.category')} isRequired items={problems} onChange={(e) => setCategory(e.target.value)}>
                {problems.map((problem, index) => (
                    <SelectItem key={index}>{problem.category}</SelectItem>
                ))}
            </Select>
            {Subcategories(category)}
            <Select onChange={(e) => handleLanguagesChange(e)} items={languagesDef} label={t('publishProblem.languages')} isRequired isMultiline selectionMode="multiple" renderValue={(languages) => {
                return (
                    <div className="flex flex-wrap gap-3">
                        {languages.map((language, index) => (
                            <Chip key={index}>{language.key}</Chip>
                        ))}
                    </div>
                )
            }}>
                {languagesDef.map((language, index) => (
                    <SelectItem key={index}>{language.value}</SelectItem>
                ))}
            </Select>
            <Textarea label={t('publishProblem.input')} onChange={(e) => setInput(e.target.value)} value={input} />
            <Textarea label={t('publishProblem.output')} onChange={(e) => setOutput(e.target.value)} value={output} />
            <Textarea label={t('publishProblem.restriction')} onChange={(e) => setRestriction(e.target.value)} value={restriction} />
            <Input type="number" required label={t('publishProblem.timeLimit')} onChange={(e) => setTimeExecution(e.target.value)} />
            <Input type="number" required label={t('publishProblem.memoryLimit')} onChange={(e) => setLimitMemory(e.target.value)} />
            <Checkbox onChange={(e) => setItsForContest(e.target.checked)}>
                {t('publishProblem.forContest')}
            </Checkbox>
            <div className="flex justify-between font-bold text-3xl">
                <p>{t('publishProblem.examples')}</p>
                <Button variant="bordered" onClick={addExample}>{t('publishProblem.addExample')}</Button>
            </div>
            {Array.from({ length: numberExamples }, (_, index) => (
                <div className="flex flex-col gap-2" key={index}>
                    <div className="flex justify-between">
                        <label>{t('publishProblem.example')} {index + 1}</label>
                        <Button variant="flat" onClick={() => deleteExample(index)} color="danger">{t('publishProblem.deleteExample')}</Button>
                    </div>
                    <Textarea isRequired type="text" label={t('publishProblem.exampleInput')} onChange={(e) => handleInputExample(index, e.target.value)} />
                    <Textarea isRequired type="text" label={t('publishProblem.exampleOutput')} onChange={(e) => handleOutputExample(index, e.target.value)} />
                    <Textarea type="text" label={t('publishProblem.exampleExplanation')} onChange={(e) => handleExampleExplanation(index, e.target.value)} />
                </div>
            ))}
            <Divider />
            <div className="flex justify-between font-bold text-3xl">
                <p>{t('publishProblem.tests')}</p>
                <Button variant="bordered" onClick={addTest}>{t('publishProblem.addTest')}</Button>
            </div>
            {Array.from({ length: numberTests }, (_, index) => (
                <div className="flex flex-col gap-2" key={index}>
                    <div className="flex justify-between">
                        <label>{t('publishProblem.test')} {index + 1}</label>
                        <Button variant="flat" onClick={() => deleteTest(index)} color="danger">{t('publishProblem.deleteTest')}</Button>
                    </div>
                    <Textarea isRequired type="text" label={t('publishProblem.testInput')} onChange={(e) => handleInputTest(index, e.target.value)} />
                    <Textarea isRequired type="text" label={t('publishProblem.testOutput')} onChange={(e) => handleOutputTest(index, e.target.value)} />
                    <Textarea isRequired type="number" label={t('publishProblem.testScore')} onChange={(e) => handleScoreTest(index, e.target.value)} />
                </div>
            ))}
            <Button variant="flat" color="danger" onClick={onOpen}>{t('publishProblem.publishButton')}</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>
                        {t('publishProblem.modalHeader')}
                    </ModalHeader>
                    <ModalBody>
                        {t('publishProblem.modalBody')}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" color="success" onClick={handleCreateProblem}>{t('publishProblem.publish')}</Button>
                        <Button variant="flat" color="danger" onClick={onClose}>{t('publishProblem.close')}</Button>
                    </ModalFooter>
                    {error && (
                        <div className="p-4">
                            <Chip className="p-4 whitespace-pre-wrap h-full rounded-lg" variant="flat" color="danger">
                                {error.message}
                            </Chip>
                        </div>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}