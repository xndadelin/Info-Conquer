import { Chip } from "@nextui-org/react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
export const ProblemInfo = ({ problem }) => {

    const { t } = useTranslation()

    const info = [
        { key: 'creator', icon: '👤', value: problem.creator },
        { key: 'difficulty', icon: '🏋️', value: problem.difficulty },
        { key: 'category', icon: '📚', value: problem.category },
        {
            key: 'subcategory', icon: '🏷️', value: <div className='flex gap-2'>
                {problem.subcategories.map((subcategory) => (
                    <Chip color='primary' className='text-xs'>{t(`problems.subcategories.${subcategory}`)}</Chip>
                ))}
            </div>
        },
        { key: 'timeLimit', icon: '⏱️', value: `${problem.timeExecution} s` },
        { key: 'memoryLimit', icon: '💾', value: `${(problem.limitMemory / 1024)} MB` },
        { key: 'solveRate', icon: '📊', value: `${parseInt(problem.successRate)}%` },
        { key: 'rating', icon: '⭐', value: problem.rating === 0 ? 'NR' : `${parseFloat(problem.rating).toFixed(2)} / 5` },
    ]
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-900 rounded-lg">
            {info.map((row) => (
                <motion.div whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.3 }
                }} key={row.key}
                    className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">{row.icon}</span>
                        <h3 className="text-gray-400 font-medium uppercase tracking-wider">
                            {t(`problem.${row.key}`)}
                        </h3>
                    </div>
                    <h3 
                        className="text-gray-200 text-lg"
                        data-cy={`problem_${row.key}`}
                    >
                        {row.key === 'category' ? t(`problems.categories.${row.value}`) :
                            row.key === 'subcategory' ? row.value : row.value}
                    </h3>
                </motion.div>
            ))}
        </section>
    )
}