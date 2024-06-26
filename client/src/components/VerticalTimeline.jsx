import { CodeEditor } from "./CodeEditor";
import { useState } from "react";
import { Waypoint } from "react-waypoint";
import { c_code, java_code, py_code, cpp_code } from "../utils/Codes";
import { useTranslation } from "react-i18next";
export const VerticalTimeline = () => {
  const { t } = useTranslation()
  const [isVisibleC, setIsVisibleC] = useState(false);
  const [isVisibleCpp, setIsVisibleCpp] = useState(false);
  const [isVisiblePython, setIsVisiblePython] = useState(false);
  const [isVisibleJava, setIsVisibleJava] = useState(false);
  return (
    <div className="relative mb-10 max-md:after:left-[32px] max-w-full after:content-[''] max-md:w-[92%] after:absolute after:w-[6px] after:bg-white after:top-0 after:bottom-0 after:left-[50%] after:ml-[-3px]">
      <Waypoint onEnter={() => setIsVisibleC(true)}>
        <div className={`${isVisibleC ? 'left-to-right': ''} container max-md:after:left-[-12.5px] max-md:left-[32px]  max-md:before:border-transparent max-md:w-[100%] max-md:px-0 relative w-[50%] px-[40px] bg-inherit left-0 after:content-[''] after:absolute after:w-[25px] after:h-[25px] after:right-[-12.5px] after:bg-white after:border-[4px] after:border-[#DA0037] after:top-[15px] after:rounded-full after:z-10 before:content-[''] before:absolute before:top-[22px] before:right-[30px] before:h-0 before:w-0 before:border-[10px] before:border-transparent before:border-r-white`}>
            <div className="relative pt-[10px] rounded-[6px]">
                <h1 className='text-5xl font-bold p-5 pb-0 pt-0 mt-0'>C</h1>
                <p className='text-lg p-5 pb-0 pt-0 max'>
                    {t('languages.c')}
                </p>
                <div className="ml-2">
                    <CodeEditor height={"500px"} language='c' code={c_code}/>
                </div>
            </div>
        </div>
      </Waypoint>
      <Waypoint onEnter={() => setIsVisibleCpp(true)}>
        <div className={`${isVisibleCpp ? 'right-to-left': ''} container max-md:left-[32px] max-md:before:border-transparent max-md:w-[100%] relative w-[50%] max-md:px-0 px-[40px] bg-inherit left-[50%] after:content-[''] after:absolute after:w-[25px] after:h-[25px] after:left-[-12.5px] after:bg-white after:border-[4px] after:border-[#DA0037] after:top-[15px] after:rounded-full after:z-10 before:content-[''] before:absolute before:top-[22px] before:left-[30px] before:h-0 before:w-0 before:border-[10px] before:border-transparent before:border-l-white`}>
            <div className="relative pt-[10px] rounded-[6px]">
            <h1 className='text-5xl font-bold p-5 pb-0 pt-0'>C++</h1>
                <p className='text-lg p-5 pb-0 pt-0'>
                    {t('languages.cpp')}
                </p>
                <div className="ml-2">
                    <CodeEditor height={"500px"} language={"cpp"} code={cpp_code}/>
                </div>
            </div>
        </div>
      </Waypoint>
      <Waypoint onEnter={() => setIsVisiblePython(true)}>
        <div className={`${isVisiblePython ? 'left-to-right' : ''} container max-md:after:left-[-12.5px] max-md:left-[32px] max-md:px-0 max-md:before:border-transparent max-md:w-[100%] relative w-[50%] px-[40px] bg-inherit left-0 after:content-[''] after:absolute after:w-[25px] after:h-[25px] after:right-[-12.5px] after:bg-white after:border-[4px] after:border-[#DA0037] after:top-[15px] after:rounded-full after:z-10 before:content-[''] before:absolute before:top-[22px] before:right-[30px] before:h-0 before:w-0 before:border-[10px] before:border-transparent before:border-r-white`}>
            <div className="relative pt-[10px] rounded-[6px]">
                <h1 className='text-5xl font-bold p-5 pb-0 pt-0'>Python</h1>
                <p className='text-lg p-5 pb-0 pt-0'>
                    {t('languages.py')}
                </p>
                <div className="ml-2">
                    <CodeEditor height={"500px"} language='python' code={py_code}/> 
                </div>
            </div>
        </div>
      </Waypoint>
      <Waypoint onEnter={() => setIsVisibleJava(true)}>
        <div className={`${isVisibleJava ? 'right-to-left' : ''} container max-md:left-[32px] max-md:before:border-transparent max-md:w-[100%] max-md:px-0 relative w-[50%] px-[40px] bg-inherit left-[50%] after:content-[''] after:absolute after:w-[25px] after:h-[25px] after:left-[-12.5px] after:bg-white after:border-[4px] after:border-[#DA0037] after:top-[15px] after:rounded-full after:z-10 before:content-[''] before:absolute before:top-[22px] before:left-[30px] before:h-0 before:w-0 before:border-[10px] before:border-transparent before:border-l-white`}>
            <div className="relative pt-[10px] rounded-[6px]">
            <h1 className='text-5xl font-bold p-5 pb-0 pt-0'>Java</h1>
                <p className='text-lg p-5 pb-0 pt-0 '>
                    {t('languages.java')}
                </p>
                <div className="ml-2">
                    <CodeEditor height={"500px"} language='java' code={java_code}/>
                </div>
            </div>
        </div>
       </Waypoint>
    </div>
  );
};
