export const code = `import math
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

export const c_code = `#include <stdio.h>
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
export const cpp_code = `#include <iostream>
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
export const py_code = `from flask import Flask, request, jsonify
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
        return jsonify({'error': 'Code and language are requi#DA0037'}), 400

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
    except subprocess.TimeoutExpi#DA0037:
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
export const java_code = `import java.util.ArrayList;
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