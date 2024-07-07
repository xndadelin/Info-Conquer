import { CodeEditor } from "./CodeEditor";
import { useTranslation } from "react-i18next";
import { c_code, java_code, py_code, cpp_code } from "../utils/Codes";
import { motion } from "framer-motion";

export const VerticalTimeline = () => {
    const { t } = useTranslation();

    const fadeInLeft = {
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const fadeInRight = {
        hidden: { opacity: 0, x: 100 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const scaleIn = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { duration: 0.1 } }
    };

    const languages = [
        { name: 'C', code: c_code, variant: fadeInLeft, language: 'c', description: 'C is a general-purpose, procedural computer programming language supporting structured programming, lexical variable scope, and recursion, with a static type system.' },
        { name: 'C++', code: cpp_code, variant: fadeInRight, language: 'cpp', description: 'C++ is a general-purpose programming language created by Bjarne Stroustrup as an extension of the C programming language, or "C with Classes".' },
        { name: 'Python', code: py_code, variant: fadeInLeft, language: 'python', description: 'Python is an interpreted high-level general-purpose programming language. Python\'s design philosophy emphasizes code readability with its notable use of significant indentation.' },
        { name: 'Java', code: java_code, variant: fadeInRight, language: 'java', description: 'Java is a class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible.' }
    ];

    return (
        <div className="relative mb-20 max-w-full after:content-[''] after:absolute after:w-1 after:bg-gradient-to-b after:from-blue-500 after:to-purple-500 after:top-0 after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2">
            {languages.map((lang, index) => (
                <motion.div 
                    key={lang.name}
                    className={`container relative w-full md:w-1/2 p-6 mb-12 z-10 ${index % 2 === 0 ? 'md:pr-12 md:left-0' : 'md:pl-12 md:left-1/2'}`}
                    initial="hidden"
                    whileInView="visible"
                    variants={lang.variant}
                >
                    <motion.div 
                        className="relative p-6 bg-gray-800 rounded-lg shadow-xl"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <motion.h1 
                            className='text-4xl font-bold mb-4 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500'
                            variants={scaleIn}
                        >
                            {lang.name}
                        </motion.h1>
                        <motion.p 
                            className='text-lg mb-6 text-gray-300'
                            variants={scaleIn}
                        >
                            {lang.description}
                        </motion.p>
                        <motion.div 
                            className="overflow-hidden rounded-lg"
                            variants={scaleIn}
                        >
                            <CodeEditor height={"300px"} language={lang.language} code={lang.code} />
                        </motion.div>
                    </motion.div>
                    <motion.div 
                        className={`absolute top-10 ${index % 2 === 0 ? 'right-0 md:-right-6' : 'left-0 md:-left-6'} w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl`}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                    >
                        {index + 1}
                    </motion.div>
                </motion.div>
            ))}
        </div>
    );
};