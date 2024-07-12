import { Button, Link } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { fadeIn, fadeInLeft, fadeInRight } from '../../utils/Fades';
import { code } from '../../utils/Codes';
import FeatureCard from '../../components/Landing/FeatureCard';
import TypingCodeEditor from '../../components/Landing/TypingCodeEditor';
import VerticalTimeline from '../../components/Landing/VerticalTimeline';

export const Landing = () => {
    const { t } = useTranslation();
    const features = [
        { icon: "M320 0c17.7 0 32 14.3 32 32V96H472c39.8 0 72 32.2 72 72V440c0 39.8-32.2 72-72 72H168c-39.8 0-72-32.2-72-72V168c0-39.8 32.2-72 72-72H288V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H208zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H304zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H400zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224H64V416H48c-26.5 0-48-21.5-48-48V272c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H576V224h16z", title: t('why_choose_section.features.0.title'), link: 'https://openai.com/', linkText: t('why_choose_section.features.0.link_text'), description: t('why_choose_section.features.0.description') },
        { icon: "M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z", title: t('why_choose_section.features.1.title'), link: '//put here the docs', linkText: t('why_choose_section.features.1.link_text'), description: t('why_choose_section.features.1.description') },
        { icon: "M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z", title: t('why_choose_section.features.2.title'), link: '/contests', linkText: t('why_choose_section.features.2.link_text'), description: t('why_choose_section.features.2.description') },
        { icon: "M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z", title: t('why_choose_section.features.3.title'), link: '/calendar', linkText: t('why_choose_section.features.3.link_text'), description: t('why_choose_section.features.3.description') },
    ];

    return (
        <main className="bg-gray-900 overflow-hidden">
            <section className="bg-gradient-to-br from-blue-950 to-gray-950 pt-16">
                <div className="container mx-auto px-4 py-20 sm:py-20 max-sm:pt-0">
                    <div className="grid grid-cols-2 max-md:grid-cols-1 gap-8">
                        <motion.div
                            className="flex flex-col gap-5 self-center"
                            initial="hidden"
                            whileInView="visible"
                            variants={fadeInLeft}
                        >
                            <h1 className="text-5xl text-white font-extrabold leading-tight max-md:text-4xl">
                                {t('welcome_section.title')}{' '}
                                <span className="from-blue-400 to-blue-200 bg-clip-text text-transparent bg-gradient-to-r">
                                    InfoConquer!
                                </span>{' '}
                                {t('welcome_section.title2')}
                            </h1>
                            <p className="text-xl text-gray-300 mt-4">
                                <span className="from-blue-400 to-blue-200 bg-clip-text text-transparent bg-gradient-to-r font-bold">InfoConquer</span>
                                {' '}{t('welcome_section.description')}
                            </p>
                            <div className='flex gap-5'>
                                <Button as={Link} href="/register" size="lg" color='primary' className="hover:scale-105 transition-transform text-lg px-8 py-3">
                                    {t('welcome_section.get_started_button')}
                                </Button>
                                <Button as={Link} href='#features' size="lg" color='secondary' className="hover:scale-105 transition-transform text-lg px-8 py-3">
                                    {t('welcome_section.learn_more_button')}
                                </Button>
                            </div>

                        </motion.div>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            variants={fadeInRight}
                        >
                            <TypingCodeEditor file={'main.py'} language="python" code={code} className="rounded-2xl shadow-2xl" />
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="bg-gray-800 py-20">
                <motion.div
                    id='features'
                    className="container mx-auto px-4"
                    initial="hidden"
                    whileInView="visible"
                    variants={fadeIn}
                >
                    <h2 className="text-5xl text-center font-bold mb-12 text-white">
                        {t('why_choose_section.title')}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <FeatureCard feature={feature} index={index} />
                        ))}
                    </div>
                </motion.div>
            </section>

            <div className="bg-gradient-to-br from-gray-900 to-blue-800 py-20">
                <div className="container mx-auto px-4">
                    <p className="text-5xl text-center font-bold text-white mb-12">
                       {t('languages.meta')}
                    </p>
                    <VerticalTimeline />
                </div>
            </div>

            <motion.section
                className="py-20"
                initial="hidden"
                whileInView="visible"
                variants={fadeIn}
            >
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-6xl font-bold text-white mb-8">
                        {t('final_call_to_action')}
                    </h2>
                    <Button
                        as={Link}
                        href="/register"
                        size="lg"
                        color="warning"
                        className="hover:scale-105 transition-transform text-lg px-8 py-3"
                    >
                        {t('welcome_section.get_started_button')}
                    </Button>
                </div>
            </motion.section>
        </main>
    );
};  