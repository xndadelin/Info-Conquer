import { Editor } from "@monaco-editor/react"
export const CodeEditor = ({language, code, height}) => {
    return (
        <div className="p-3">
                    <div className="text-5xl flex flex-col p-0 h-[100%]">
                        <div className="flex h-[25px] p-0 justify-start bg-neutral-800">
                            <div className="h-[13px] ml-2 mr-1 my-1 self-center w-[13px] rounded-full bg-red-500"></div>
                            <div className="h-[13px] mx-1 self-center w-[13px] rounded-full bg-yellow-400"></div>
                            <div className="h-[13px] mx-1 self-center w-[13px] rounded-full bg-green-600"></div>
                        </div>
                        <div className={`h-[${height}] flex-1`}>
                            <Editor options={{
                                minimap: {enabled: false},
                                fontSize: 15,
                                scrollbar: {vertical: 'hidden', horizontal: 'hidden'},
                                readOnly: true
                            }} theme="vs-dark" height={height} language={language} defaultValue={code}/>
                        </div>
                    </div>
                </div>
    )
}