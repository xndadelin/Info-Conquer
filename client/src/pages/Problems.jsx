import { CardBody, CardHeader, Card, Divider } from "@nextui-org/react"
import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/react"
import { Link } from "react-router-dom"
export const Problems = () => {
    const problems = [
        {
            category: 'Array',
            subcategories: [
                'Static Arrays',
                'Dynamic Arrays',
                'Bidimensional Arrays',
                'Subarray Problems',
                'Matrix Problems',
                'Rotation of Arrays',
                'Sliding Window Problems',
                'Two Pointers Technique',
                'Prefix Sum Problems',
                'Histogram Problems',
                'Array Partitioning',
                'Maximum Subarray Problems',
                'Minimum Subarray Problems',
                'Sum Pair Problems',
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
                'BFS (Breadth-First Search) Problems',
                'Sliding Window Problems using Queues',
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
                'Tree Problems with Recursion',
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
                'Graph Problems with Recursion',
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
        <div className="container mx-auto my-4">
            <h1 className="font-bold text-5xl mb-4 max-sm:p-4">Data Structures</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-sm:p-4">
                {problems.map((problem) => (
                <Card key={problem.category}>
                    <CardHeader>
                    <Link to={`/problems/${problem.category}`}>{problem.category}</Link>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                    <Listbox>
                        {problem.subcategories.map((subcategory) => (
                        <ListboxItem key={subcategory}>
                            <Link to={`/problems/${problem.category}/${subcategory}`}>
                            {subcategory}
                            </Link>
                        </ListboxItem>
                        ))}
                    </Listbox>
                    </CardBody>
                </Card>
                ))}
            </div>
        </div>
    )
}