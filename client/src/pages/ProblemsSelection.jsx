import { useTranslation } from 'react-i18next';
import { Link } from '@nextui-org/react';
import { motion } from 'framer-motion';

export const problems = [
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
];


export const ProblemsSelection = () => {
    const { t } = useTranslation();

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto mt-20 mb-20 px-4 text-white"
        >
            <section className="text-center mb-16">
                <h1 className="text-6xl font-extrabold">
                    {t('problems.header')}
                </h1>
                <p className="text-2xl text-gray-300 mt-6 max-w-2xl mx-auto">
                    {t('problems.description')}
                </p>
            </section>
            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
                {problems.map((problem, index) => (
                    <motion.div
                        key={problem.category}
                        whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px -5px rgba(0, 0, 0, 0.3)" }}
                        className="flex flex-col p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg overflow-hidden"
                    >
                        <Link href={`/problems/${problem.category}/none`} className="text-3xl font-bold text-primary-400 mb-4 hover:text-primary-300 transition-colors">
                            {t(`problems.categories.${problem.category}`)}
                        </Link>
                        <div className="flex-grow">
                            <ul className="space-y-2">
                                {problem.subcategories.map((subcategory) => (
                                    <li key={subcategory} className="flex items-center space-x-2">
                                        <span className="text-secondary-400">•</span>
                                        <Link href={`/problems/${problem.category}/${subcategory}`} className="text-gray-300 hover:text-white transition-colors">
                                            {t(`problems.subcategories.${subcategory}`)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-6">
                            <Link 
                                href={`/problems/${problem.category}/none`}
                                className="inline-block px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-500 transition-colors"
                            >
                                {t('problems.viewAll')}
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </motion.section>
        </motion.main>
    );
};