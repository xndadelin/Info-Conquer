import { useState } from 'react';
import { motion } from 'framer-motion';

const AccordionIcon = ({ icon }) => (
    <svg className="w-6 h-6 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
    </svg>
);

const Accordion = ({ title, content, icon }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <motion.section className="mb-6 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <button
                className="w-full flex items-center justify-between p-4 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center">
                    <AccordionIcon icon={icon} />
                    <h2 className="text-xl font-semibold text-gray-100">{title}</h2>
                </div>
                <svg
                    className={`w-6 h-6 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
            >
                <div className="p-4 bg-gray-700">
                    <div className="text-base leading-relaxed text-gray-200" dangerouslySetInnerHTML={{ __html: content }}></div>
                </div>
            </motion.div>
        </motion.section>
    );
};

export const ProblemDescription = ({ problem, t }) => {
    return (
        <div className="container mx-auto p-6 bg-gray-900 rounded-xl shadow-2xl space-y-6">
            {problem.getProblem.description && (
                <Accordion
                    title={t('problem.description')}
                    content={problem.getProblem.description}
                    icon="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            )}
            {problem.getProblem.requirements && (
                <Accordion
                    
                    title={t('problem.requirements')}
                    content={problem.getProblem.requirements}
                    icon="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                />
            )}
            {problem.getProblem.input && (
                <Accordion
                    title={t('problem.input')}
                    content={problem.getProblem.input}
                    icon="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                />
            )}
            {problem.getProblem.output && (
                <Accordion
                    title={t('problem.output')}
                    content={problem.getProblem.output}
                    icon="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                />
            )}
            {problem.getProblem.examples && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold mb-2 text-gray-100 flex items-center">
                        <AccordionIcon icon="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                        {t('problem.example')}
                    </h2>
                    {problem.getProblem.examples.map((example, index) => (
                        <div className="bg-gray-800 p-6 rounded-lg border border-gray-600 hover:border-blue-500 transition-colors duration-300">
                            <h3 className="text-xl font-semibold text-gray-100 mb-4">{t('problem.example')} {index + 1}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-100 flex items-center">
                                        <AccordionIcon icon="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                        {t('problem.input')}
                                    </h4>
                                    <pre className="p-3 bg-gray-900 rounded-md text-gray-200 overflow-x-auto">{example.input}</pre>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-100 flex items-center">
                                        <AccordionIcon icon="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                        {t('problem.output')}
                                    </h4>
                                    <pre className="p-3 bg-gray-900 rounded-md text-gray-200 overflow-x-auto">{example.output}</pre>
                                </div>
                            </div>
                            {example.explanation && (
                                <div className="mt-4">
                                    <h4 className="font-semibold text-gray-100 flex items-center">
                                        <AccordionIcon icon="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                        {t('problem.explanation')}
                                    </h4>
                                    <pre className="p-3 bg-gray-900 rounded-md text-gray-200 mt-2 overflow-x-auto" dangerouslySetInnerHTML={{ __html: example.explanation }}></pre>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {problem.getProblem.restriction && (
                <Accordion
                    title={t('problem.restrictions')}
                    content={problem.getProblem.restriction}
                    icon="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
            )}
        </div>
    );
};