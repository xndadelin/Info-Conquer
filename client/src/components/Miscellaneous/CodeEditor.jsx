import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';

export const CodeEditor = ({ language, code, file }) => {
  return (
    <section className="flex flex-col h-full rounded-lg overflow-hidden shadow-lg border border-gray-700">
      <header className="flex h-[40px] justify-between items-center bg-gradient-to-r from-gray-800 to-gray-700 px-4">
        <div className="flex items-center flex-1">
          <div className="h-[12px] w-[12px] rounded-full bg-red-500 mr-2"></div>
          <div className="h-[12px] w-[12px] rounded-full bg-yellow-400 mr-2"></div>
          <div className="h-[12px] w-[12px] rounded-full bg-green-500"></div>
        </div>
        <span className="text-sm text-gray-300 font-semibold">{file}</span>
        <div className="flex items-center flex-1 justify-end gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        </div>
      </header>
      <div className="flex-1 bg-gray-900">
        <CodeMirror
          extensions={[loadLanguage(language)]}
          height='550px'
          value={code}
          theme={oneDark}
          className="text-sm"
        />
      </div>
      <footer className="h-[30px] bg-gray-800 flex items-center justify-between px-4">
        <span className="text-xs text-gray-400">{language.toUpperCase()}</span>
        <span className="text-xs text-gray-400">Lines: {code.split('\n').length}</span>
      </footer>
    </section>
  );
};