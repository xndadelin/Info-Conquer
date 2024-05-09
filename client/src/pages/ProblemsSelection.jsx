import {  Link } from "@nextui-org/react"

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
    return (
        <div className="container mx-auto my-4 px-4">
            <h1 className="font-bold text-5xl mb-4">Data Structures</h1>
            <div className="flex gap-10 flex-wrap">
                {problems.map((problem, index) => (
                    <div className="flex flex-col">
                        <Link href={`/problems/${problem.category}`} key={index} color="danger" isBlock className="text-2xl font-bold">{problem.category}</Link>
                        <div className="flex flex-col">
                            {problem.subcategories.map((subcategory, index) => (
                                <Link href={`/problems/${problem.category}/${subcategory}`} key={index} color="foreground" isBlock>{subcategory}</Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}