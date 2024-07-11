import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CodeEditor } from '../Miscellaneous/CodeEditor';

const TypingCodeEditor = ({ code, language, file }) => {
    const [displayedCode, setDisplayedCode] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < code.length) {
            const timeout = setTimeout(() => {
                setDisplayedCode(prevCode => prevCode + code[currentIndex]);
                setCurrentIndex(currentIndex + 1);
            }, 1);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, code]);

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <CodeEditor file={file} language={language} code={displayedCode} />
        </motion.section>
    );
};

export default TypingCodeEditor;