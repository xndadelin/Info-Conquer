import { Select, SelectItem, Button, Tooltip, Textarea } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';


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

    const { isOpen, onOpen, onClose } = useDisclosure();

    return user?.getUser ? (
        <main>
            <section className="flex flex-wrap justify-between items-center bg-[#1e1e1e] rounded-tl-2xl rounded-tr-2xl">
                <Select
                    defaultSelectedKeys={[language]}
                    onChange={(e) => onChangeLanguage(e.target.value)}
                    label={t('problem.selectLanguage')}
                    className="sm:w-48 mb-2 sm:mb-0"
                    data-cy="problem_languages"
                >
                    {problem.getProblem.languages.map((lang) => (<SelectItem key={lang} value={lang}>{lang}</SelectItem>))}
                </Select>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <Button
                        onClick={onOpen}
                        className="mt-2 mb-2 mr-2"
                        color="warning"
                        variant="flat"
                        data-cy="problem_chatbot_button"
                        isLoading={loadingBot}
                    >
                        🤖 Get help from AI!
                    </Button>

                    <Modal 
                        isOpen={isOpen} 
                        onClose={onClose} 
                        size="2xl"
                        className='bg-gray-800'
                        backdrop='blur'
                    >
                        <ModalContent>
                            <ModalHeader>Chat with AI</ModalHeader>
                            <ModalBody>
                                <p>Ask the AI assistant for help with your problem.</p>
                                <Textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Type your question here..."
                                    className="w-full mt-2"
                                    classNames={{
                                        inputWrapper: 'bg-gray-900 focus:bg-gray-900 hover:bg-gray-800',
                                    }}
                                    data-cy="problem_chatbot_prompt"
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); getChatbotMessage(); setPrompt(''); onClose(); } }}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onClick={onClose}>
                                    Close
                                </Button>
                                <Button
                                    color="warning"
                                    onClick={() => { getChatbotMessage(); setPrompt(''); onClose(); }}
                                    isLoading={loadingBot}
                                    isDisabled={!prompt}
                                    data-cy="problem_chatbot_send"
                                >
                                    Send
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>


                    <Tooltip
                        color="danger"
                        content={t('problem.runCode')}
                    >
                        <Button
                            className="mt-2 mr-2 mb-2"
                            color="danger"
                            disabled={!language || !code || !user || !user.getUser}
                            variant="flat" onClick={() => { onHandleSubmitSolution(); onOpenChange(); setTests('') }}
                            data-cy="problem_submit"
                        >
                            {t('problem.submit')}
                        </Button>
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
                    data-cy="problem_editor_logged"
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
                data-cy="problem_editor_not_logged"
            />
        </section>
    );
}
