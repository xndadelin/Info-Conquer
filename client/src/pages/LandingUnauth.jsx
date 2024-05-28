import { Button, Divider, Link } from '@nextui-org/react';
import Editor from '@monaco-editor/react';
import {Card, CardHeader, CardBody} from "@nextui-org/react";
export const Landing = () => {
  const code = `#include <iostream>

using namespace std;
int n;
struct Nod{
    int info;
    Nod *leg;
};
void FAdaugaInainte(Nod * &head){
    Nod *current = head;
    Nod *lastCurrent = nullptr;
    Nod *nou;
    while(current != nullptr){
        if(current -> info % 2){
            nou = new Nod;
            nou -> info = current -> info * 2;
            nou -> leg = current;
            if(lastCurrent != nullptr){
                lastCurrent -> leg = nou;
            }else{
                head = nou;
            }
        }
        lastCurrent = current;
        current = current -> leg;
    }
}
int main()
{
    Nod *prim, *ultim, *nou;
    prim = new Nod;
    prim -> info = 123;
    prim -> leg = nullptr;
    ultim = prim;
    int n, a; cin >> n;
    for(int i = 1; i <= n; ++i){
        cin >> a;
        nou = new Nod;
        nou -> info = a;
        nou -> leg = nullptr;
        ultim -> leg = nou;
        ultim = nou;
    }
    Nod *p = prim -> leg;
    FAdaugaInainte(p);
    while(p){
        cout << p -> info << " ";
        p = p -> leg;
    }
    return 0;
}`  
  return (
    <div className='flex flex-col container mx-auto'>
        <div>
            <svg className='z-1 absolute top-0' viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#121212" d="M44.8,-49.4C57.9,-42.3,68.3,-28.1,73.2,-11.3C78,5.5,77.3,24.8,67.4,36C57.5,47.2,38.4,50.2,21,55.7C3.6,61.1,-12.2,69,-23.7,64.9C-35.2,60.8,-42.5,44.8,-49,30C-55.6,15.2,-61.4,1.7,-63.6,-15.6C-65.8,-32.9,-64.3,-53.9,-53.1,-61.3C-41.9,-68.7,-21,-62.5,-2.6,-59.4C15.8,-56.4,31.6,-56.5,44.8,-49.4Z" transform="translate(100 100)" />
            </svg>
            <div className="grid grid-cols-2 max-md:grid-cols-1 z-2 relative flex-wrap md:mt-[200px] z-2">
                <div className="flex p-4 flex-col gap-5 max-md:mt-[100px]">
                    <div className="text-5xl text-white font-extrabold">
                    🚀 Welcome to{' '}
                    <span className="from-[#ed3131] to-[#f9f7f5] cursor-pointer bg-clip-text text-transparent bg-gradient-to-b">
                        InfoConquer!
                    </span>{' '}
                    Your ultimate hub for problem-solving!
                    </div>
                    <div>
                        <Button size="lg" variant="flat">
                            Get started by creating an account!
                        </Button>
                    </div>
                    <div className='text-lg'>
                        <span className='from-[#ed3131] to-[#f9f7f5] cursor-pointer bg-clip-text text-transparent bg-gradient-to-b'>InfoConquer</span> is dedicated to everyone who wants to learn programming by solving problems, reading articles, and participating in a forum-style community that encourages collaboration, knowledge-sharing, and skill development. Start conquering today!
                    </div>
                </div>
                <div className="p-3">
                    <div className="text-5xl flex flex-col p-0 h-[100%]">
                        <div className="flex h-[25px] p-0 justify-start bg-neutral-800">
                            <div className="h-[13px] ml-2 mr-1 my-1 self-center w-[13px] rounded-full bg-red-500"></div>
                            <div className="h-[13px] mx-1 self-center w-[13px] rounded-full bg-yellow-400"></div>
                            <div className="h-[13px] mx-1 self-center w-[13px] rounded-full bg-green-600"></div>
                        </div>
                        <div className='h-[500px] flex-1'>
                            <Editor options={{
                                minimap: {enabled: false},
                                fontSize: 12,
                                scrollbar: {vertical: 'hidden', horizontal: 'hidden'},
                                readOnly: true,
                            }} theme="vs-dark" height="500px" language="cpp" defaultValue={code}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='mt-4 z-2 relative'>
            <div className='flex flex-col p-3'>
                <div className='text-5xl text-center font-bold mb-10'>
                    Why choose InfoConquer?
                </div>
                <div className='flex gap-2 justify-center align-center max-md:flex-col'>
                    <Card>
                        <CardHeader>
                            <svg height={25} className='mr-2' xmlns="http://www.w3.org/2000/svg" fill='white' viewBox="0 0 640 512"><path d="M320 0c17.7 0 32 14.3 32 32V96H472c39.8 0 72 32.2 72 72V440c0 39.8-32.2 72-72 72H168c-39.8 0-72-32.2-72-72V168c0-39.8 32.2-72 72-72H288V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H208zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H304zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H400zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224H64V416H48c-26.5 0-48-21.5-48-48V272c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H576V224h16z"/></svg>
                            <div className='flex flex-col'>
                                <p className='text-md'>
                                    Integrated OpenAI feedback
                                </p>
                                <a className='text-sm text-default-500' href='//put here the docs' >OpenAI Platform</a>
                            </div>
                        </CardHeader>
                        <Divider/>
                        <CardBody>
                           <p>Enjoy the benefits of our integrated OpenAI ChatGPT feedback. At request, you can get a feedback on your code from ChatGPT as soon as you submit it.</p>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardHeader>
                        <svg fill='white' height={25} className='mr-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"/></svg>
                            <div className='flex flex-col'>
                                <p className='text-md'>
                                    Code judger integrated
                                </p>
                                <a className='text-sm text-default-500' href='//put here the docs' >See how I have done it</a>
                            </div>
                        </CardHeader>
                        <Divider/>
                        <CardBody>
                           <p>Our integrated code judger will help you test your code against a variety of test cases. You can also see the time and memory consumption of your code, as well as the output and the expected output to point out your mistakes.</p>
                        </CardBody>
                    </Card>
                    <Card> 
                        <CardHeader>
                        <svg height={25} className='mr-2' fill='white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM64 256c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>
                            <div className='flex flex-col'>
                                <p className='text-md'>Variety of problems</p>
                                <a className='text-sm text-default-500' href='https://159.89.12.247:3001/problems'>See problems</a>
                            </div>
                        </CardHeader>
                        <Divider/>
                        <CardBody>
                           <p>InfoConquer is your gateway to the exciting world of programming. Immerse yourself in a diverse range of problems.</p>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardHeader>
                        <svg className='mr-2' fill='white' height={25} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"/></svg>
                            <div className='flex flex-col'>
                                <p className='text-md'>
                                    Article publishing
                                </p>
                                <a className='text-sm text-default-500' href='https://159.89.12.247:3001/articles'>See articles</a>
                            </div>
                        </CardHeader>
                        <Divider/>
                        <CardBody>
                           <p>
                              Share your knowledge with the world by publishing articles on InfoConquer. Our forum is the perfect place to discuss ideas, ask questions, and share your insights.
                           </p>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
        <div className='mt-4 z-2 relative text-center font-bold text-5xl mb-[100px]'>
            <h1>So what are you waiting for? Create an account and start coding!😎</h1>
        </div>
    </div>
  );
};
