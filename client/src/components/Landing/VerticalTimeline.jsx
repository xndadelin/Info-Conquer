import { CodeEditor } from "../Miscellaneous/CodeEditor";
import { c_code, java_code, py_code, cpp_code } from "../../utils/Codes";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {fadeInLeft, fadeInRight, scaleIn} from "../../utils/Fades";


const VerticalTimeline = () => {

    const { t } = useTranslation();

    const languages = [
        {file: 'main.c', name: 'C', code: c_code, variant: fadeInLeft, language: 'c', description: t('languages.c') },
        {file: 'main.cpp', name: 'C++', code: cpp_code, variant: fadeInRight, language: 'cpp', description: t('languages.coo') },
        {file: 'main.py', name: 'Python', code: py_code, variant: fadeInLeft, language: 'python', description: t('languages.python') },
        {file: 'main.java', name: 'Java', code: java_code, variant: fadeInRight, language: 'java', description: t('languages.java') }
    ];

    return (
        <section className="relative mb-20 max-w-full after:content-[''] after:absolute after:w-1 after:bg-gray-800 after:top-0 after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2">
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
                            className='text-4xl font-bold mb-4 text-gradient bg-clip-text text-transparent text-white'
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
                            <CodeEditor file={lang.file} height={"300px"} language={lang.language} code={lang.code} />
                        </motion.div>
                    </motion.div>
                    <motion.div 
                        className={`absolute top-10 ${index % 2 === 0 ? 'right-0 md:-right-6' : 'left-0 md:-left-6'} w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-xl`}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                    >
                        {index + 1}
                    </motion.div>
                </motion.div>
            ))}
        </section>
    );
};

export default VerticalTimeline;