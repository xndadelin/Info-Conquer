import { Select, SelectItem, Button, Tooltip, Textarea } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';

const placeholder = `#include <iostream>
#include <cstring>
#include <string>
#include <fstream>
#include <cmath>
using namespace std;

ifstream in("caesar.in");
ofstream out("dbftbs.out");

char alfabet[] = "abcdefghijklmnopqrstuvwxyz";

int cautachar(char c) {
    char cp = tolower(c);
    for (int i = 0; i < strlen(alfabet); ++i) {
        if (alfabet[i] == cp) {
            return i;
        }
    }
    return 0;
}

void encrypt(char text[], int cheie) {
    char cipher[257] = "";
    int cnt = 0;
    for (int i = 0; i < strlen(text); ++i) {
        if (isalpha(text[i])) {
            if (islower(text[i])) {
                cipher[cnt++] = alfabet[(cautachar(text[i]) + cheie) % 26];
            } else {
                cipher[cnt++] = (alfabet[(cautachar(text[i]) + cheie) % 26] - 32);
            }
        } else {
            cipher[cnt++] = text[i];
        }
    }
    out << cipher;
}

void decrypt(char text[], int cheie) {
    char plain[257] = "";
    int cnt = 0;
    for (int i = 0; i < strlen(text); ++i) {
        if (isalpha(text[i])) {
            if (islower(text[i])) {
                plain[cnt++] = alfabet[(cautachar(text[i]) - cheie + 26) % 26];
            } else {
                plain[cnt++] = toupper(alfabet[(cautachar(text[i]) - cheie + 26) % 26]);
            }
        } else {
            plain[cnt++] = text[i];
        }
    }
    out << plain;
}


int main() {
    char text[257];
    in.getline(text, 257);
    int cheie;
    in >> cheie;
    in.ignore();
    char operatie[20];
    in.getline(operatie, 20);
    if (strcmp(operatie, "encrypt") == 0) {
        encrypt(text, cheie);
    } else {
        decrypt(text, cheie);
    }
    return 0;
}
`
const languages_for_editor = {
    'C++': 'cpp',
    'Python': 'python',
    'Java': 'java',
    'Javascript': 'javascript',
    'C#': 'csharp',
    'C': 'c',
    'Rust': 'rust',
    'PHP': 'php',
}


export const ProblemEditor = ({ user, problem, language, code, onChangeLanguage, onChangeCode, onHandleSubmitSolution, onOpenChange, setTests, getChatbotMessage, loadingBot, prompt, setPrompt }) => {

    const { t } = useTranslation();

    return user?.getUser ? (
        <main>
            <section className="flex flex-wrap justify-between items-center bg-[#1e1e1e] rounded-tl-2xl rounded-tr-2xl">
                <Select 
                    defaultSelectedKeys={[language]} 
                    onChange={(e) => onChangeLanguage(e.target.value)} 
                    label={t('problem.selectLanguage')} 
                    className="sm:w-48 mb-2 sm:mb-0"
                >
                    {problem.getProblem.languages.map((lang) => (<SelectItem key={lang} value={lang}>{lang}</SelectItem>))}
                </Select>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <Tooltip 
                        size="sm" 
                        closeDelay={1000} color="warning" placement="left" content={<div><p>{t('problem.chatGPT')}</p><p>{t('problem.chatGPTNote')}</p><Textarea onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); getChatbotMessage(); setPrompt(''); } }} endContent={<Button isLoading={loadingBot} disabled={!prompt} color="warning" className="self-end text-2xl" size="sm" variant="flat" onClick={() => getChatbotMessage()}>↑</Button>} onChange={(e) => setPrompt(e.target.value)} value={prompt} label={t('problem.prompt')} className="w-full" /></div>}>
                        <Button isLoading={loadingBot} className="mt-2 mb-2 mr-2" color="warning" variant="flat">🤖</Button>
                    </Tooltip>

                    <Tooltip color="danger" content={t('problem.runCode')}>
                        <Button className="mt-2 mb-2" color="danger" disabled={!language || !code || !user || !user.getUser} variant="flat" onClick={() => { onHandleSubmitSolution(); onOpenChange(); setTests('') }}>{t('problem.submit')}</Button>
                    </Tooltip>
                </div>
            </section>
            <section className='overflow-auto'>
                <CodeMirror
                    value={code}
                    theme={oneDark}
                    extensions={[loadLanguage(languages_for_editor[language] || 'markdown')]}
                    onChange={onChangeCode}
                    height="700px"
                    className='max-w-full'
                />
            </section>
        </main>
    ) : (
        <section>
            <CodeMirror
                value={placeholder}
                theme={oneDark}
                extensions={[loadLanguage(languages_for_editor[language] || 'markdown')]}
                className="rounded-md overflow-hidden blur-sm"
                readOnly
                height="100%"
            />
        </section>
    );
}
