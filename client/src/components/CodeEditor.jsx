import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';

export const CodeEditor = ({ language, code }) => {
    return (
        <section className="text-5xl flex flex-col h-full">
            <header className="flex h-[25px] justify-start bg-neutral-800">
                <div className="h-[13px] ml-2 mr-1 my-1 w-[13px] rounded-full bg-red-500"></div>
                <div className="h-[13px] mx-1 my-1 w-[13px] rounded-full bg-yellow-400"></div>
                <div className="h-[13px] mx-1 my-1 w-[13px] rounded-full bg-green-600"></div>
            </header>
            <div className="flex-1">
                <CodeMirror
                    extensions={[loadLanguage(language)]}
                    height='550px'
                    value={code}
                    theme={oneDark}
                />
            </div>
        </section>
    );
};