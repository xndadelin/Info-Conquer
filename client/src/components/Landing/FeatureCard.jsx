import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fadeInLeft, fadeInRight } from "../../utils/Fades";


const FeatureCard = ({ feature, index }) => {
    return (
        <motion.section
            className="relative overflow-hidden p-8 bg-gradient-to-br from-blue-950 via-gray-800 to-gray-900 rounded-2xl shadow-2xl transition-all duration-300 ease-in-out group"
            initial="hidden"
            whileInView="visible"
            variants={index % 2 === 0 ? fadeInLeft : fadeInRight}
            whileHover={{ scale: 1.03 }}
        >
            <motion.div
                className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500"
            />
            <motion.div
                className="relative z-10 flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
            >
                <svg className="h-8 w-8 text-center" fill="currentColor" viewBox="0 0 640 512">
                    <path d={feature.icon} />
                </svg>
            </motion.div>
            <section className="mt-6">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                    {feature.title}
                </h3>
                <h5 className="text-lg text-gray-300 mb-6 group-hover:text-white transition-colors">
                    {feature.description}
                </h5>
                <Link
                    to={feature.link}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 group"
                >
                    <span>{feature.linkText}</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mt-1 ml-2 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 32 32"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </Link>
            </section>
        </motion.section>
    );
};

export default FeatureCard;