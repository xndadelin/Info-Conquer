import { CodeEditor } from "./CodeEditor";
import { useState } from "react";
import { Waypoint } from "react-waypoint";
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
export const VerticalTimeline = () => {
  const [isVisibleC, setIsVisibleC] = useState(false);
  const [isVisibleCpp, setIsVisibleCpp] = useState(false);
  const [isVisiblePython, setIsVisiblePython] = useState(false);
  const [isVisibleJava, setIsVisibleJava] = useState(false);
  return (
    <div className="relative mb-10 max-md:after:left-[32px] max-w-full after:content-[''] max-md:w-[92%] after:absolute after:w-[6px] after:bg-white after:top-0 after:bottom-0 after:left-[50%] after:ml-[-3px]">
      <Waypoint onEnter={() => setIsVisibleC(true)}>
        <div className={`${isVisibleC ? 'left-to-right': ''} container max-md:after:left-[-12.5px] max-md:left-[32px]  max-md:before:border-transparent max-md:w-[100%] max-md:px-0 relative w-[50%] px-[40px] bg-inherit left-0 after:content-[''] after:absolute after:w-[25px] after:h-[25px] after:right-[-12.5px] after:bg-white after:border-[4px] after:border-[red] after:top-[15px] after:rounded-full after:z-10 before:content-[''] before:absolute before:top-[22px] before:right-[30px] before:h-0 before:w-0 before:border-[10px] before:border-transparent before:border-r-white`}>
            <div className="relative pt-[10px] rounded-[6px]">
                <h1 className='text-5xl font-bold p-5 pb-0 pt-0 mt-0'>C</h1>
                <p className='text-lg p-5 pb-0 pt-0 max'>
                    C is a general-purpose, procedural computer programming language supporting structured programming, lexical variable scope, and recursion, with a static type system.
                </p>
                <div className="ml-2">
                    <CodeEditor height={"500px"} language='c' code={c_code}/>
                </div>
            </div>
        </div>
      </Waypoint>
      <Waypoint onEnter={() => setIsVisibleCpp(true)}>
        <div className={`${isVisibleCpp ? 'right-to-left': ''} container max-md:left-[32px] max-md:before:border-transparent max-md:w-[100%] relative w-[50%] max-md:px-0 px-[40px] bg-inherit left-[50%] after:content-[''] after:absolute after:w-[25px] after:h-[25px] after:left-[-12.5px] after:bg-white after:border-[4px] after:border-[red] after:top-[15px] after:rounded-full after:z-10 before:content-[''] before:absolute before:top-[22px] before:left-[30px] before:h-0 before:w-0 before:border-[10px] before:border-transparent before:border-l-white`}>
            <div className="relative pt-[10px] rounded-[6px]">
            <h1 className='text-5xl font-bold p-5 pb-0 pt-0'>C++</h1>
                <p className='text-lg p-5 pb-0 pt-0'>
                    C++ is a general-purpose programming language created as an extension of the C programming language, or "C with Classes".
                </p>
                <div className="ml-2">
                    <CodeEditor height={"500px"} language={"cpp"} code={cpp_code}/>
                </div>
            </div>
        </div>
      </Waypoint>
      <Waypoint onEnter={() => setIsVisiblePython(true)}>
        <div className={`${isVisiblePython ? 'left-to-right' : ''} container max-md:after:left-[-12.5px] max-md:left-[32px] max-md:px-0 max-md:before:border-transparent max-md:w-[100%] relative w-[50%] px-[40px] bg-inherit left-0 after:content-[''] after:absolute after:w-[25px] after:h-[25px] after:right-[-12.5px] after:bg-white after:border-[4px] after:border-[red] after:top-[15px] after:rounded-full after:z-10 before:content-[''] before:absolute before:top-[22px] before:right-[30px] before:h-0 before:w-0 before:border-[10px] before:border-transparent before:border-r-white`}>
            <div className="relative pt-[10px] rounded-[6px]">
                <h1 className='text-5xl font-bold p-5 pb-0 pt-0'>Python</h1>
                <p className='text-lg p-5 pb-0 pt-0'>
                    Python is an interpreted, high-level, general-purpose programming language.
                </p>
                <div className="ml-2">
                    <CodeEditor height={"500px"} language='python' code={py_code}/> 
                </div>
            </div>
        </div>
      </Waypoint>
      <Waypoint onEnter={() => setIsVisibleJava(true)}>
        <div className={`${isVisibleJava ? 'right-to-left' : ''} container max-md:left-[32px] max-md:before:border-transparent max-md:w-[100%] max-md:px-0 relative w-[50%] px-[40px] bg-inherit left-[50%] after:content-[''] after:absolute after:w-[25px] after:h-[25px] after:left-[-12.5px] after:bg-white after:border-[4px] after:border-[red] after:top-[15px] after:rounded-full after:z-10 before:content-[''] before:absolute before:top-[22px] before:left-[30px] before:h-0 before:w-0 before:border-[10px] before:border-transparent before:border-l-white`}>
            <div className="relative pt-[10px] rounded-[6px]">
            <h1 className='text-5xl font-bold p-5 pb-0 pt-0'>Java</h1>
                <p className='text-lg p-5 pb-0 pt-0 '>
                    Java is a class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible.
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
