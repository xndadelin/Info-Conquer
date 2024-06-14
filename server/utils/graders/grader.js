const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
global.crypto = require('crypto');

const languages = {
    'C++': {
        'compile': 'g++ -O2 -o main main.cpp -Wall 2> error.txt',
        'extension': 'cpp',
        'run': './main',
        'file': 'main.cpp',
    },
    'C': {
        'compile': 'gcc -O2 -o main main.c -Wall 2> error.txt',
        'extension': 'c',
        'run': './main',
        'file': 'main.c'
    },
    'C#': {
        'compile': 'mcs -out:main.exe main.cs 2> error.txt',
        'extension': 'cs',
        'run': 'mono main.exe',
        'file': 'main.cs'
    },
    'Java': {
        'compile': 'javac main.java 2> error.txt',
        'extension': 'java',
        'run': 'java -cp . main',
        'file': 'main.java'
    },
    'Python': {
        'compile': 'python3 -m py_compile main.py 2> error.txt',
        'extension': 'py',
        'run': 'python3 main.py',
        'file': 'main.py'
    },
    'Javascript': {
        'compile': 'node main.js 2> error.txt',
        'extension': 'js',
        'run': 'node main.js',
        'file': 'main.js'
    },
    'Ruby': {
        'compile': 'ruby -c main.rb 2> error.txt',
        'extension': 'rb',
        'run': 'ruby main.rb',
        'file': 'main.rb'
    },
}

const initialize = () => {
    const idSolution = crypto.randomUUID();
    const received_time = new Date();
    return {idSolution, received_time};
}

const populate_sandbox = (sandboxPath, code, file) => {
    fs.writeFileSync(path.join(sandboxPath, 'box', file), code);
}

const compile = (language, sandboxPath) => {
    const error = fs.writeFileSync(path.join(sandboxPath, 'box', 'error.txt'), '');
    const command = languages[language].compile;
    try{
        execSync(command, {cwd: path.join(sandboxPath, 'box')});
        return {status: 'OK', message: 'The code was successfully compiled.'};
    }catch(e){
        return {status: 'ERROR', message: 'The code could not be compiled.', error: check_error(sandboxPath)};
    }
}

const check_error = (sandboxPath) => {
    const error = fs.readFileSync(path.join(sandboxPath, 'box', 'error.txt')).toString();
    return error;
}

const get_file_size = (sandboxPath, file) => {
    const File = fs.statSync(path.join(sandboxPath, 'box', file));
    return File.size / 1024;
}

const prepare_sandbox = (language, code) => {
    const file = languages[language].file;
    const sandboxPath = execSync(`isolate --box-id=1 --init`).toString().trim();
    const input = path.join(sandboxPath, 'box', 'input.txt');
    const output = path.join(sandboxPath, 'box', 'output.txt');
    const meta = path.join(sandboxPath, 'box', 'meta.txt');
    fs.writeFileSync(path.join(sandboxPath, 'box', file), code);
    return {sandboxPath, input, output, meta};
}

const run = (language, sandboxPath, testCase, inputPath, outputPath) => {
    const command = languages[language].run;
    fs.writeFileSync(inputPath, testCase.input);
    fs.writeFileSync(outputPath, ''); 
    execSync(`isolate --box-id=1 --meta=${path.join(sandboxPath, 'box', 'meta.txt')} --stdin=input.txt --stdout=output.txt --run -- "${command}"`, {cwd: path.join(sandboxPath, 'box')});
    output = fs.readFileSync(path.join(sandboxPath, 'box', 'output.txt')).toString();
    const meta = fs.readFileSync(path.join(sandboxPath, 'box', 'meta.txt')).toString();
    return {output, meta};
}

const check_files = (sandboxPath) => {
    const files = fs.readdirSync(path.join(sandboxPath, 'box'));
    console.log(files);
    return files
}

const grader = (testCases, code, problem, username, language, max_time, max_memory) => {
    max_time = parseFloat(max_time);
    max_memory = parseFloat(max_memory);
    const {idSolution, received_time} = initialize();
    const {sandboxPath, input, output, meta} = prepare_sandbox(language, code);
    populate_sandbox(sandboxPath, code, languages[language].file);

    const {status, message, error} = compile(language, sandboxPath)
    const results = [];
    check_files(sandboxPath);
    if(status === 'ERROR'){
        return {
            username,
            code,
            problem,
            language,
            score: 0,
            test: null,
            fileMemory: get_file_size(sandboxPath, languages[language].file),
            compilationError: error,
            success: false,
            id_solution: idSolution,
            date: new Date(),
        }
    }else {
        testCases.forEach((testCase) => {
            const {output: outputResult, meta: metaResult} = run(language, sandboxPath, testCase, input, output);
            const meta_data = metaResult.split('\n')
            const time = parseFloat(meta_data[0].split(':')[1])
            const max_rss = parseFloat(meta_data[2].split(':')[1])
            const exitcode = (meta_data[5].split(':')[1])
            if(outputResult === testCase.output && time <= max_time && max_rss <= max_memory){
                results.push({
                    status: 'AC',
                    success: true,
                    executionTime: time,
                    memoryUsed: max_rss,
                    score: testCase.score,
                    input: testCase.input,
                    output: outputResult,
                    expectedOutput: testCase.output,
                })
                return ;
            }else {
                if(time > max_time && max_rss > max_memory){
                    results.push({
                        status: 'TLE_MLE',
                        success: false,
                        executionTime: time,
                        memoryUsed: max_rss,
                        score: 0,
                        input: testCase.input,
                        output: outputResult,
                        expectedOutput: testCase.output,
                    })
                    return ;
                }
                if(time > max_time){
                    results.push({
                        status: 'TLE',
                        success: false,
                        executionTime: time,
                        memoryUsed: max_rss,
                        score: 0,
                        input: testCase.input,
                        output: outputResult,
                        expectedOutput: testCase.output,
                    })
                    return ;
                }
                if(max_rss > max_memory){
                    results.push({
                        status: 'MLE',
                        success: false,
                        executionTime: time,
                        memoryUsed: max_rss,
                        score: 0,
                        input: testCase.input,
                        output: outputResult,
                        expectedOutput: testCase.output,
                    })
                    return ;
                }
                if(outputResult !== testCase.output){
                    results.push({
                        status: 'WA',
                        success: false,
                        executionTime: time,
                        memoryUsed: max_rss,
                        score: 0,
                        input: testCase.input,
                        output: outputResult,
                        expectedOutput: testCase.output,
                    })
                    return ;
                }
            }
        })
    }
    const success = results.every(test => test.success);
    const score = results.reduce((acc, test) => acc + parseInt(test.score), 0);
    return {
        username,
        code,
        problem,
        language,
        score,
        tests: results,
        fileMemory: get_file_size(sandboxPath, languages[language].file),
        date: new Date(),
        compilationError: null,
        success,
        id_solution: idSolution,
    }
}

module.exports = { grader };