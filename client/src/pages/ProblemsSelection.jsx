import { CardBody, CardHeader, Card, Divider, Chip } from "@nextui-org/react"
import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/react"
import { Link } from "react-router-dom"
export const ProblemsSelection = () => {
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
                'Double-ended Queues',
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
                'Binary Search Trees',
                'AVL Trees',
                'Heap Trees',
                'Trie',
                'N-ary Trees',
                'Segment Trees',
                'Binary Indexed Trees',
                'Tree Traversal',
                'Level Order Traversal',
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
            category: 'Hashing',
            subcategories: [
                'Hash Tables',
                'Hash Functions',
                'Collision Resolution',
                'Types of Hash Functions',
                'Cuckoo Hashing',
                'Probabilistic Data Structures',
                'Hashing in String Processing',
                'Hashing Applications'
            ]
        }
        
    ]
    return (
        <div className="container mx-auto my-4 px-4">
            <h1 className="font-bold text-5xl mb-4">Data Structures</h1>
            <div className="flex flex-col gap-10">
                {problems.map((problem) => (
                    <>
                        <div className="flex gap-4">
                            <h2 className="font-bold text-4xl">{problem.category}</h2>
                            <div className="flex">
                                <div className="flex gap-3 flex-wrap">
                                    {problem.subcategories.map((subcategory) => (
                                        <Link to={`/problems/${problem.category}/${subcategory}`}>
                                            <Chip size="lg">{subcategory}</Chip>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Divider/>
                    </>
                ))}
            </div>
        </div>
    )
}