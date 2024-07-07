import { Button, Link } from '@nextui-org/react';
import { CodeEditor } from '../components/CodeEditor';
import { Background } from '../components/Background';
import { VerticalTimeline } from '../components/VerticalTimeline';
import { useTranslation } from 'react-i18next';
import { code } from '../utils/Codes';
import { motion } from 'framer-motion';

export const Landing = () => {
    const { t } = useTranslation()

    const fadeInLeft = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
    };

    const fadeInRight = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
    };

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const features = [
        { icon: "M320 0c17.7 0 32 14.3 32 32V96H472c39.8 0 72 32.2 72 72V440c0 39.8-32.2 72-72 72H168c-39.8 0-72-32.2-72-72V168c0-39.8 32.2-72 72-72H288V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H208zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H304zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H400zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224H64V416H48c-26.5 0-48-21.5-48-48V272c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H576V224h16z", title: t('why_choose_section.features.0.title'), link: '//put here the docs', linkText: t('why_choose_section.features.0.link_text'), description: t('why_choose_section.features.0.description') },
        { icon: "M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z", title: t('why_choose_section.features.1.title'), link: '//put here the docs', linkText: t('why_choose_section.features.1.link_text'), description: t('why_choose_section.features.1.description') },
        { icon: "M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM64 256c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z", title: t('why_choose_section.features.2.title'), link: 'http://localhost:3000/problems', linkText: t('why_choose_section.features.2.link_text'), description: t('why_choose_section.features.2.description') },
        { icon: "M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z", title: t('why_choose_section.features.3.title'), link: 'http://localhost:3000/articles', linkText: t('why_choose_section.features.3.link_text'), description: t('why_choose_section.features.3.description') },
    ];

    return (
        <div className='flex flex-col container mx-auto overflow-hidden'>
            <Background />
            <div className="grid grid-cols-2 max-md:grid-cols-1 z-2 relative flex-wrap md:mt-[200px] z-2">
                <motion.div 
                    className={`flex p-4 flex-col gap-5 max-md:mt-[100px]`}
                    initial="hidden"
                    whileInView="visible"
                    variants={fadeInLeft}

                >
                    <h1 className="text-6xl text-white font-extrabold leading-tight">
                        {t('welcome_section.title')}{' '}
                        <span className="from-[#002E62] to-[#338EF7] cursor-pointer bg-clip-text text-transparent bg-gradient-to-r">
                            InfoConquer!
                        </span>{' '}
                        {t('welcome_section.title2')}
                    </h1>
                    <Button as={Link} href='/register' size="lg" color="primary" className="w-fit hover:scale-105 transition-transform">
                        {t('welcome_section.get_started_button')}
                    </Button>
                    <p className='text-xl text-gray-300'>
                        <span className='from-[#002E62] to-[#338EF7] cursor-pointer bg-clip-text text-transparent bg-gradient-to-r font-bold'>InfoConquer</span>
                        {' '}{t('welcome_section.description')} 
                    </p>
                </motion.div>
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    variants={fadeInRight}
                >
                    <CodeEditor language="python" code={code} height={"500px"}/>
                </motion.div>
            </div>
            <motion.div 
                className="mt-20 z-2 relative"
                initial="hidden"
                whileInView="visible"
                variants={fadeIn}
            >
                <h2 className='text-5xl text-center font-bold mb-12 text-white'>
                    {t('why_choose_section.title')}
                </h2>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mt-20">
                        <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 mb-20">
                            {features.map((feature, index) => (
                                <motion.div 
                                    className="relative"
                                    initial="hidden"
                                    whileInView="visible"
                                    variants={index % 2 === 0 ? fadeInLeft : fadeInRight}
                
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <dt>
                                        <motion.div 
                                            className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 640 512">
                                                <path d={feature.icon} />
                                            </svg>
                                        </motion.div>
                                        <p className="ml-16 text-lg leading-6 font-medium text-white">{feature.title}</p>
                                    </dt>
                                    <dd className="mt-2 ml-16 text-base text-gray-400">
                                        {feature.description}
                                        <Link 
                                            href={feature.link}
                                            className="block mt-2 text-primary-400 hover:text-primary-300 transition-colors"
                                        >
                                            {feature.linkText} →
                                        </Link>
                                    </dd>
                                </motion.div>
                            ))}
                        </dl>
                    </div>
                </div>
            </motion.div>
            <VerticalTimeline />
            <motion.div 
                className="mt-20 z-2 relative text-center mb-20"
                initial="hidden"
                whileInView="visible"
                variants={fadeIn}
            >
                <h2 className="text-6xl font-bold text-white mb-8">
                    {t('final_call_to_action')}
                </h2>
                <Button as={Link} href='/register' size="lg" color="primary" className="hover:scale-105 transition-transform">
                    {t('welcome_section.get_started_button')}
                </Button>
            </motion.div>
        </div>
    );
};