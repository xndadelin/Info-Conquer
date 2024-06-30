import { Button, Divider, Link } from '@nextui-org/react';
import {Card, CardHeader, CardBody} from "@nextui-org/react";
import { CodeEditor } from '../components/CodeEditor';
import {Waypoint} from 'react-waypoint';
import { useState } from 'react';
import { Background } from '../components/Background';
import { VerticalTimeline } from '../components/VerticalTimeline';
import { useTranslation } from 'react-i18next';
import { code } from '../utils/Codes';
export const Landing = () => {
const [isVisibleWelcome, setIsVisibleWelcome] = useState(false);
const [isVisibleCode, setIsVisibleCode] = useState(false);
const [isVisibleWhy, setIsVisibleWhy] = useState(false);
const [isVisibleStart, setIsVisibleStart] = useState(false);
const { t } = useTranslation()
return (
    <div className='flex flex-col container mx-auto'>
        <Background/>
        <div className="grid grid-cols-2 max-md:grid-cols-1 z-2 relative flex-wrap md:mt-[200px] z-2">
            <Waypoint onEnter={() => setIsVisibleWelcome(true)}>
                <div className={`flex p-4 flex-col gap-5 max-md:mt-[100px] ${isVisibleWelcome ? 'left-to-right': ''}`}>
                    <div className="text-5xl text-white font-extrabold">
                        {t('welcome_section.title')}
                        <span className="from-[#DA0037] to-[#f9f7f5] cursor-pointer bg-clip-text text-transparent bg-gradient-to-r">
                            InfoConquer!
                        </span>{' '}
                        {t('welcome_section.title2')}
                    </div>
                    <div>
                        <Button as={Link} href='/register' size="lg" variant="flat">
                            {t('welcome_section.get_started_button')}
                        </Button>
                    </div>
                    <div className='text-lg'>
                        <span className='from-[#DA0037] to-[#f9f7f5] cursor-pointer bg-clip-text text-transparent bg-gradient-to-r'>InfoConquer</span>
                        {t('welcome_section.description')} 
                    </div>
                </div>
            </Waypoint>
            <Waypoint onEnter={() => setIsVisibleCode(true)}>
                <div className={` ${isVisibleCode ? 'right-to-left': ''}`}>
                    <CodeEditor language="python" code={code} height={"500px"}/>
                </div>
            </Waypoint>
        </div>
        <Waypoint onEnter={() => setIsVisibleWhy(true)}>
            <div className={`mt-4 z-2 relative ${isVisibleWhy ? 'left-to-right': ''}`}>
                <div className='flex flex-col p-3'>
                    <div className='text-5xl text-center font-bold mb-10'>
                        {t('why_choose_section.title')}
                    </div>
                    <div className='flex gap-2 justify-center align-center max-md:flex-col'>
                        <Card className='flex-1'>
                            <CardHeader>
                                <svg height={25} className='mr-2' xmlns="http://www.w3.org/2000/svg" fill='white' viewBox="0 0 640 512"><path d="M320 0c17.7 0 32 14.3 32 32V96H472c39.8 0 72 32.2 72 72V440c0 39.8-32.2 72-72 72H168c-39.8 0-72-32.2-72-72V168c0-39.8 32.2-72 72-72H288V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H208zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H304zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H400zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224H64V416H48c-26.5 0-48-21.5-48-48V272c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H576V224h16z"/></svg>
                                <div className='flex flex-col'>
                                    <p className='text-md'>
                                        {t('why_choose_section.features.0.title')}
                                    </p>
                                    <a className='text-sm text-default-500' href='//put here the docs'>
                                        {t('why_choose_section.features.0.link_text')}
                                    </a>
                                </div>
                            </CardHeader>
                            <Divider/>
                            <CardBody>
                                {t('why_choose_section.features.0.description')}
                            </CardBody>
                        </Card>
                        <Card className='flex-1'>
                            <CardHeader>
                            <svg fill='white' height={25} className='mr-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"/></svg>
                                <div className='flex flex-col'>
                                    <p className='text-md'>
                                        {t('why_choose_section.features.1.title')}
                                    </p>
                                    <a className='text-sm text-default-500' href='//put here the docs'>
                                        {t('why_choose_section.features.1.link_text')}
                                    </a>
                                </div>
                            </CardHeader>
                            <Divider/>
                            <CardBody>
                                {t('why_choose_section.features.0.description')}
                            </CardBody>
                        </Card>
                        <Card className='flex-1'> 
                            <CardHeader>
                            <svg height={25} className='mr-2' fill='white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM64 256c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>
                                <div className='flex flex-col'>
                                    <p className='text-md'>
                                        {t('why_choose_section.features.2.title')}
                                    </p>
                                    <a className='text-sm text-default-500' href='http://localhost:3000/problems'>
                                        {t('why_choose_section.features.2.link_text')}
                                    </a>
                                </div>
                            </CardHeader>
                            <Divider/>
                            <CardBody>
                                {t('why_choose_section.features.2.description')}      
                            </CardBody>
                        </Card>
                        <Card className='flex-1'>
                            <CardHeader>
                            <svg className='mr-2' fill='white' height={25} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"/></svg>
                                <div className='flex flex-col'>
                                    <p className='text-md'>
                                        {t('why_choose_section.features.3.title')}
                                    </p>
                                    <a className='text-sm text-default-500' href='http://localhost:3000/articles'>
                                        {t('why_choose_section.features.3.link_text')}  
                                    </a>
                                </div>
                            </CardHeader>
                            <Divider/>
                            <CardBody>
                                {t('why_choose_section.features.3.description')}
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </Waypoint>
        <VerticalTimeline/>
        <Waypoint onEnter={() => setIsVisibleStart(true)}>
            <div className={`mt-4 z-2 relative text-center font-bold text-5xl mb-[100px] ${isVisibleStart ? 'right-to-left': ''}`}>
                <h1>
                    {t('final_call_to_action')}
                </h1>
            </div>
        </Waypoint>
    </div>
  );
};
