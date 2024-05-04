import { Listbox, ListboxItem } from "@nextui-org/react"
import { Link } from "react-router-dom"

export const ProblemsSelection = () => {
    const problems = [
        {
            category: 'Array',
            subcategories: [
                'Static Arrays',
                'Dynamic Arrays',
                'Bidimensional Arrays',
                'Subarray',
                'Matrix',
                'Rotation of Arrays',
                'Sliding Window',
                'Two Pointers Technique',
                'Prefix Sum',
                'Histogram',
                'Array Partitioning',
                'Maximum Subarray',
                'Minimum Subarray',
                'Sum Pair',
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
                'BFS (Breadth-First Search)',
                'Sliding Window using Queues',
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
                'Tree with Recursion',
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
                'Graph with Recursion',
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
            <div className="flex gap-10 flex-wrap">
                {problems.map((problem, index) => (
                        <Listbox className="flex-1" key={index}>
                            <ListboxItem>
                                <p className="text-3xl">{problem.category}</p>
                            </ListboxItem> 
                            {problem.subcategories.map((subcategory, subIndex) => (
                                <ListboxItem key={subIndex}>
                                    <Link to={`/problems/${problem.category}/${subcategory}`}>
                                        {subcategory}
                                    </Link>
                                </ListboxItem>
                            ))}
                        </Listbox>
                ))}
            </div>
        </div>
    )
}