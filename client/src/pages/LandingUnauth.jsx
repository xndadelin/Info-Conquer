import { Button, Divider, Link } from '@nextui-org/react';
import {Card, CardHeader, CardBody} from "@nextui-org/react";
import { CodeEditor } from '../components/CodeEditor';
import {Waypoint} from 'react-waypoint';
import { useState } from 'react';
export const Landing = () => {
const [isVisibleWelcome, setIsVisibleWelcome] = useState(false);
const [isVisibleCode, setIsVisibleCode] = useState(false);
const [isVisibleWhy, setIsVisibleWhy] = useState(false);
const [isVisibleC, setIsVisibleC] = useState(false);
const [isVisibleCpp, setIsVisibleCpp] = useState(false);
const [isVisiblePython, setIsVisiblePython] = useState(false);
const [isVisibleJava, setIsVisibleJava] = useState(false);
const [isVisibleStart, setIsVisibleStart] = useState(false);
const [isVisibleDocs, setIsVisibleDocs] = useState(false);
const code = `import math
from Crypto.Util.number import long_to_bytes
def gcd_extended(a, b):
    if a == 0:
        return b, 0, 1
    gcd, x1, y1 = gcd_extended(b % a, a)
    x = y1 - (b // a) * x1
    y = x1
    return gcd, x, y
  
def modular_inverse(e, phi):
    gcd, x, y = gcd_extended(e, phi)
    if gcd != 1:
        raise ValueError("Modular inverse does not exist")
    return x % phi
  
sieve = [1] * 1000000
sieve[0] = sieve[1] = 0
sieve[2] = 1
primes = []
  
def sieve_of_eratosthenes(n):
    for i in range(3, int(math.sqrt(n) + 1)):
        if sieve[i] == 1:
            for j in range(i * i, n, i):
                sieve[j] = 0
    for i in range(2, n):
        if sieve[i] == 1:
            primes.append(i)
  
def is_prime(a):
    if a < 2:
        return False
    else:
        d = 0
        while primes[d] * primes[d] <= a:
            if a % primes[d] == 0:
                return False
            d += 1
        return True
def encrypt(e, n):
    message = input("Enter the message: ")
    enc_mes = []
  
    for char in message:
        enc_mes.append(ord(char))
  
    enc_mes = [pow(char, e, n) for char in enc_mes]
    return enc_mes
  
def decrypt(d, n, enc_mes):
    dec_mes = [chr(pow(char, d, n)) for char in enc_mes]
    return "".join(dec_mes)
  
  # sieve_of_eratosthenes(100000)

p = 1617549722683965197900599011412144490161 
q = 475693130177488446807040098678772442581573
n = p * q
phi = (p - 1) * (q - 1)
e = 65537
d = modular_inverse(e, phi)
c = 8533139361076999596208540806559574687666062896040360148742851107661304651861689
decrypted = pow(c, d, n)
print(long_to_bytes(decrypted))`  
const c_code = `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <pthread.h>

#define PORT 8080
#define MAX_CLIENTS 10
#define BUFFER_SIZE 1024

int client_sockets[MAX_CLIENTS];
int num_clients = 0;
pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;

void *handle_client(void *arg) {
    int client_socket = *(int *)arg;
    char buffer[BUFFER_SIZE];
    int bytes_received;

    while (1) {
        bytes_received = recv(client_socket, buffer, BUFFER_SIZE, 0);
        if (bytes_received <= 0) {
            break;
        }

        // Process the received data and generate a response
        // ...

        send(client_socket, buffer, bytes_received, 0);
    }

    pthread_mutex_lock(&mutex);
    for (int i = 0; i < num_clients; i++) {
        if (client_sockets[i] == client_socket) {
            for (int j = i; j < num_clients - 1; j++) {
                client_sockets[j] = client_sockets[j + 1];
            }
            num_clients--;
            break;
        }
    }
    pthread_mutex_unlock(&mutex);

    close(client_socket);
    return NULL;
}

int main() {
    int server_socket, client_socket;
    struct sockaddr_in server_addr, client_addr;
    socklen_t client_addr_size;
    pthread_t thread;

    server_socket = socket(AF_INET, SOCK_STREAM, 0);
    if (server_socket < 0) {
        perror("Error creating socket");
        return 1;
    }

    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(PORT);
    server_addr.sin_addr.s_addr = INADDR_ANY;

    if (bind(server_socket, (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0) {
        perror("Error binding socket");
        return 1;
    }

    if (listen(server_socket, MAX_CLIENTS) < 0) {
        perror("Error listening on socket");
        return 1;
    }

    printf("Server listening on port %d...", PORT);

    while (1) {
        client_addr_size = sizeof(client_addr);
        client_socket = accept(server_socket, (struct sockaddr *)&client_addr, &client_addr_size);
        if (client_socket < 0) {
            perror("Error accepting client connection");
            continue;
        }

        pthread_mutex_lock(&mutex);
        if (num_clients < MAX_CLIENTS) {
            client_sockets[num_clients++] = client_socket;
            pthread_create(&thread, NULL, handle_client, &client_sockets[num_clients - 1]);
        } else {
            printf("Maximum number of clients reached. Rejecting connection.");
            close(client_socket);
        }
        pthread_mutex_unlock(&mutex);
    }

    return 0;
}
`
const cpp_code = `#include <iostream>
#include <fstream>
#include <string>
#include <cstdlib>
#include <cstdio>

class FortranCodeJudger {
public:
    FortranCodeJudger(const std::string& sourceFile, const std::string& inputFile, const std::string& outputFile)
        : sourceFile(sourceFile), inputFile(inputFile), outputFile(outputFile) {}

    bool compile() {
        std::string command = "gfortran " + sourceFile + " -o program";
        return system(command.c_str()) == 0;
    }

    bool run() {
        std::string command = "./program < " + inputFile + " > " + outputFile;
        return system(command.c_str()) == 0;
    }

    bool compareOutput(const std::string& expectedOutputFile) {
        std::ifstream output(outputFile);
        std::ifstream expectedOutput(expectedOutputFile);

        if (!output.is_open() || !expectedOutput.is_open()) {
            return false;
        }

        std::string outputLine, expectedLine;
        while (std::getline(output, outputLine) && std::getline(expectedOutput, expectedLine)) {
            if (outputLine != expectedLine) {
                return false;
            }
        }

        return output.eof() && expectedOutput.eof();
    }

private:
    std::string sourceFile;
    std::string inputFile;
    std::string outputFile;
};

int main() {
    FortranCodeJudger judger("program.f90", "input.txt", "output.txt");

    if (!judger.compile()) {
        std::cerr << "Compilation failed." << std::endl;
        return 1;
    }

    if (!judger.run()) {
        std::cerr << "Execution failed." << std::endl;
        return 1;
    }

    if (judger.compareOutput("expected_output.txt")) {
        std::cout << "Output matches expected output." << std::endl;
    } else {
        std::cout << "Output does not match expected output." << std::endl;
    }

    return 0;
}
`
const py_code = `from flask import Flask, request, jsonify
import subprocess
import os
import uuid

app = Flask(__name__)

@app.route('/submit', methods=['POST'])
def submit_code():
    data = request.json
    code = data.get('code')
    language = data.get('language')
    input_data = data.get('input', '')

    if not code or not language:
        return jsonify({'error': 'Code and language are required'}), 400

    file_extension = {
        'python': 'py',
        'cpp': 'cpp',
        'java': 'java'
    }.get(language)

    if not file_extension:
        return jsonify({'error': 'Unsupported language'}), 400

    file_name = f"{uuid.uuid4()}.{file_extension}"
    with open(file_name, 'w') as code_file:
        code_file.write(code)

    try:
        if language == 'python':
            result = subprocess.run(['python', file_name], input=input_data, text=True, capture_output=True, timeout=5)
        elif language == 'cpp':
            executable = file_name.replace('.cpp', '')
            subprocess.run(['g++', file_name, '-o', executable], check=True)
            result = subprocess.run([f'./{executable}'], input=input_data, text=True, capture_output=True, timeout=5)
        elif language == 'java':
            subprocess.run(['javac', file_name], check=True)
            class_name = file_name.replace('.java', '')
            result = subprocess.run(['java', class_name], input=input_data, text=True, capture_output=True, timeout=5)

        output = result.stdout
        error = result.stderr
    except subprocess.CalledProcessError as e:
        return jsonify({'error': str(e)}), 500
    except subprocess.TimeoutExpired:
        return jsonify({'error': 'Execution timed out'}), 500
    finally:
        os.remove(file_name)
        if language == 'cpp':
            os.remove(executable)
        elif language == 'java':
            os.remove(f"{class_name}.class")

    return jsonify({'output': output, 'error': error})

if __name__ == '__main__':
    app.run(debug=True)
`
const java_code = `
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

class Transaction {
    private String sender;
    private String receiver;
    private double amount;
    private Date timestamp;

    public Transaction(String sender, String receiver, double amount) {
        this.sender = sender;
        this.receiver = receiver;
        this.amount = amount;
        this.timestamp = new Date();
    }

    public String getSender() {
        return sender;
    }

    public String getReceiver() {
        return receiver;
    }

    public double getAmount() {
        return amount;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    @Override
    public String toString() {
        return "Transaction{" +
                "sender='" + sender + '\'' +
                ", receiver='" + receiver + '\'' +
                ", amount=" + amount +
                ", timestamp=" + timestamp +
                '}';
    }
}

class Block {
    private int index;
    private long timestamp;
    private List<Transaction> transactions;
    private String previousHash;
    private String hash;

    public Block(int index, long timestamp, List<Transaction> transactions, String previousHash) {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = calculateHash();
    }

    public String calculateHash() {
        StringBuilder sb = new StringBuilder();
        sb.append(index).append(timestamp).append(transactions.toString()).append(previousHash);
        return Integer.toHexString(sb.toString().hashCode());
    }

    public int getIndex() {
        return index;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public String getPreviousHash() {
        return previousHash;
    }

    public String getHash() {
        return hash;
    }

    @Override
    public String toString() {
        return "Block{" +
                "index=" + index +
                ", timestamp=" + timestamp +
                ", transactions=" + transactions +
                ", previousHash='" + previousHash + '\'' +
                ", hash='" + hash + '\'' +
                '}';
    }
}

class Blockchain {
    private List<Block> chain;

    public Blockchain() {
        chain = new ArrayList<>();
        chain.add(createGenesisBlock());
    }

    private Block createGenesisBlock() {
        return new Block(0, new Date().getTime(), new ArrayList<>(), "0");
    }

    public Block getLatestBlock() {
        return chain.get(chain.size() - 1);
    }

    public void addBlock(List<Transaction> transactions) {
        Block latestBlock = getLatestBlock();
        Block newBlock = new Block(latestBlock.getIndex() + 1, new Date().getTime(), transactions, latestBlock.getHash());
        chain.add(newBlock);
    }

    public List<Block> getChain() {
        return chain;
    }

    public boolean isChainValid() {
        for (int i = 1; i < chain.size(); i++) {
            Block currentBlock = chain.get(i);
            Block previousBlock = chain.get(i - 1);

            if (!currentBlock.getHash().equals(currentBlock.calculateHash())) {
                return false;
            }

            if (!currentBlock.getPreviousHash().equals(previousBlock.getHash())) {
                return false;
            }
        }
        return true;
    }
}

public class BankTransactionAPI {
    private Blockchain blockchain;

    public BankTransactionAPI() {
        blockchain = new Blockchain();
    }

    public void addTransaction(String sender, String receiver, double amount) {
        List<Transaction> transactions = new ArrayList<>();
        transactions.add(new Transaction(sender, receiver, amount));
        blockchain.addBlock(transactions);
    }

    public List<Block> getBlockchain() {
        return blockchain.getChain();
    }

    public boolean validateBlockchain() {
        return blockchain.isChainValid();
    }

    public static void main(String[] args) {
        BankTransactionAPI api = new BankTransactionAPI();
        api.addTransaction("Alice", "Bob", 50.0);
        api.addTransaction("Bob", "Charlie", 30.0);

        System.out.println("Blockchain: " + api.getBlockchain());
        System.out.println("Is blockchain valid? " + api.validateBlockchain());
    }
}
`

return (
    <div className='flex flex-col container mx-auto'>
        <div>
            <div className="grid grid-cols-2 max-md:grid-cols-1 z-2 relative flex-wrap md:mt-[200px] z-2">
                <Waypoint onEnter={() => setIsVisibleWelcome(true)}>
                    <div className={`flex p-4 flex-col gap-5 max-md:mt-[100px] ${isVisibleWelcome ? 'left-to-right': ''}`}>
                        <div className="text-5xl text-white font-extrabold">
                        🚀 Welcome to{' '}
                        <span className="from-[#ed3131] to-[#f9f7f5] cursor-pointer bg-clip-text text-transparent bg-gradient-to-b">
                            InfoConquer!
                        </span>{' '}
                        Your ultimate hub for problem-solving!
                        </div>
                        <div>
                            <Button as={Link} href='/register' size="lg" variant="flat">
                                Get started by creating an account!
                            </Button>
                        </div>
                        <div className='text-lg'>
                            <span className='from-[#ed3131] to-[#f9f7f5] cursor-pointer bg-clip-text text-transparent bg-gradient-to-b'>InfoConquer</span> is dedicated to everyone who wants to learn programming by solving problems, participating in contests with other users, tackling challenges and problems. You can after create an article with your own solutions!
                        </div>
                    </div>
                </Waypoint>
                <Waypoint onEnter={() => setIsVisibleCode(true)}>
                    <div className={` ${isVisibleCode ? 'right-to-left': ''}`}>
                        <CodeEditor language="python" code={code} height={"500px"}/>
                    </div>
                </Waypoint>
            </div>
        </div>
        <Waypoint onEnter={() => setIsVisibleWhy(true)}>
            <div className={`mt-4 z-2 relative ${isVisibleWhy ? 'left-to-right': ''}`}>
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
                                        Integrated OpenAI Helper
                                    </p>
                                    <a className='text-sm text-default-500' href='//put here the docs' >OpenAI Platform</a>
                                </div>
                            </CardHeader>
                            <Divider/>
                            <CardBody>
                            <p>Enjoy the benefits of our integrated OpenAI ChatGPT feedback. At request, you can get a feedback on your code from ChatGPT anytime you want.</p>
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
                                    <a className='text-sm text-default-500' href='http://localhost:3000/problems'>See problems</a>
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
                                    <a className='text-sm text-default-500' href='http://localhost:3000/articles'>See articles</a>
                                </div>
                            </CardHeader>
                            <Divider/>
                            <CardBody>
                            <p>
                                Share your knowledge with the world by publishing articles on InfoConquer. Our platform is the perfect place to share your insights.
                            </p>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </Waypoint>
        <div className='relative mt-10'>
        <div className='w-[2px] h-[2750px] bg-white z-20 mx-auto absolute left-[50%]'></div>
            <div className='flex flex-col mt-4 gap-5'>
                <div className='flex justify-between'>
                    <Waypoint onEnter={() => setIsVisibleC(true)}>
                        <div className={`flex-1 ${isVisibleC ? 'left-to-right': ''}`}>
                            <h1 className='text-5xl font-bold'>C</h1>
                            <p className='text-lg'>
                                C is a general-purpose, procedural computer programming language supporting structured programming, lexical variable scope, and recursion, with a static type system.
                            </p>
                        </div>
                    </Waypoint>
                    <div className=' rounded-full bg-white w-[50px] h-[50px]'></div>
                    <div className='flex-1'>
                        <Waypoint onEnter={() => setIsVisibleC(true)}/>
                            <div className={`flex flex-col ${isVisibleC ? 'right-to-left': ''}`}>
                                <CodeEditor language="c" code={c_code} height={"500px"}/>
                            </div>
                        <Waypoint/>
                    </div>
                </div>
                <div className='flex justify-between mt-40 gap-5'>
                    <div className='flex-1'>
                        <Waypoint onEnter={() => setIsVisibleCpp(true)}>
                            <div className={`flex flex-col ${isVisibleCpp ? 'left-to-right': ''}`}>
                                <CodeEditor language="cpp" code={cpp_code} height={"500px"}/>
                            </div>
                        </Waypoint>
                    </div>
                    <div className=' rounded-full bg-white w-[50px] h-[50px]'></div>
                    <Waypoint onEnter={() => setIsVisibleCpp(true)}>
                        <div className={`flex-1 ${isVisibleCpp ? 'right-to-left': ''}`}>
                            <h1 className='text-5xl font-bold'>C++</h1>
                            <p className='text-lg'>
                                C++ is a general-purpose programming language created by Bjarne Stroustrup as an extension of the C programming language, or "C with Classes".
                            </p>
                        </div>
                    </Waypoint>
                </div>
                <div className='flex justify-between mt-40 gap-5'>
                    <Waypoint onEnter={() => setIsVisiblePython(true)}>
                        <div className={`flex-1 ${isVisiblePython ? 'left-to-right': ''}`}>
                            <h1 className='text-5xl font-bold'>Python</h1>
                            <p className='text-lg'>
                                Python is an interpreted high-level general-purpose programming language. Python's design philosophy emphasizes code readability with its notable use of significant indentation.
                            </p>
                        </div>
                    </Waypoint>
                    <div className=' rounded-full bg-white w-[50px] h-[50px]'></div>
                    <div className='flex-1'>
                        <Waypoint onEnter={() => setIsVisiblePython(true)}>
                            <div className={`flex flex-col ${isVisiblePython ? 'right-to-left': ''}`}>
                                <CodeEditor language="python" code={py_code} height={"500px"}/>
                            </div>
                        </Waypoint>
                    </div>
                </div>
                <div className='flex justify-between mt-40 gap-5'>
                    <Waypoint onEnter={() => setIsVisibleJava(true)}>
                        <div className={`flex-1 ${isVisibleJava ? 'left-to-right': ''}`}>
                            <CodeEditor language="java" code={java_code} height={"500px"}/>
                        </div>
                    </Waypoint>
                    <div className=' rounded-full bg-white w-[50px] h-[50px]'></div>
                    <Waypoint onEnter={() => setIsVisibleJava(true)}>
                        <div className={`flex-1 ${isVisibleJava ? 'right-to-left': ''}`}>
                            <h1 className='text-5xl font-bold'>Java</h1>
                            <p className='text-lg'>
                                Java is a class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible.
                            </p>
                        </div>
                    </Waypoint>
                </div>
            </div>
        </div>
        <Waypoint onEnter={() => setIsVisibleStart(true)}>
            <div className={`mt-4 z-2 relative text-center font-bold text-5xl mb-[100px] ${isVisibleStart ? 'right-to-left': ''}`}>
                <h1>So what are you waiting for? Create an account and start coding!😎</h1>
            </div>
        </Waypoint>
        <Waypoint onEnter={() => setIsVisibleDocs(true)}>
            <div className={`z-2 relative grid grid-cols-2 items-center max-md:grid-cols-1 max-md:flex max-md:flex-col gap-4 p-2 mb-2 h-[1100px] border-white ${isVisibleDocs ? 'left-to-right': ''}`}>
                <p className='text-5xl font-bold text-center'>📜 This website has been developed for the InfoEducatie contest</p>
                <iframe className='border-white w-[100%] h-[100%]' src="https://drive.google.com/file/d/1_Lo7s8pUpVfLTK9L65YzGYa6KdQ9cj11/preview" allow="autoplay"></iframe>
            </div>
        </Waypoint>
    </div>
  );
};
