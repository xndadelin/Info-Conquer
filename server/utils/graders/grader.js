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
        'compile': 'dotnet new console -o main && cp main.cs main/Program.cs && cd main && dotnet build -c Release 2> error.txt && cd .. && cp -r main/bin/Release/net8.0/ /var/local/lib/isolate/1/box/program',
        'extension': 'cs',
        'run': './program/main',
        'file': 'main.cs',
    },
    'Java': {
        'compile': 'javac Main.java 2> error.txt',
        'extension': 'java',
        'run': './Main.jar',
        'file': 'Main.java',
        'requirement': 'touch MANIFEST.MF && echo "Main-Class: Main \nJVM-Args: -Xmx4g -Xms2g" > MANIFEST.MF && jar cfm Main.jar MANIFEST.MF Main.class && chmod +x Main.jar',
    },
    'Python': {
        'compile': 'python3 -m py_compile main.py 2> error.txt',
        'extension': 'py',
        'run': './main.py',
        'file': 'main.py',
        'requirement': 'chmod +x main.py',
        'shebang': '#!/usr/bin/env python3'
    },
    'Javascript': {
        'compile': 'node main.js > /dev/null 2> error.txt',
        'extension': 'js',
        'run': './main.js',
        'file': 'main.js',
        'requirement': 'chmod +x main.js',
        'shebang': '#!/usr/bin/env node'
    },
    'Ruby': {
        'compile': 'ruby -c main.rb 2> error.txt',
        'extension': 'rb',
        'run': 'ruby main.rb',
        'file': 'main.rb'
    },
    'Rust': {
        'compile': 'rustc main.rs 2> error.txt',
        'extension': 'rs',
        'run': './main',
        'file': 'main.rs'
    },
    'Go': {
        'compile': "go build main.go 2> error.txt && go mod init main",
        'extension': 'go',
        'run': './main',
        'file': 'main.go',
    },
    'PHP': {
        'compile': 'php -l main.php 2> error.txt',
        'extension': 'php',
        'run': './main.php',
        'file': 'main.php',
        'shebang': '#!/usr/bin/env php',
        'requirement': 'chmod +x main.php'
    },
}
const initialize = () => {
    const idSolution = crypto.randomUUID();
    const received_time = new Date();
    return { idSolution, received_time };
}

const populate_sandbox = (sandboxPath, code, file, language) => {
    let file_content = code;
    if (languages[language].shebang) {
        file_content = languages[language].shebang + '\n' + code;
    }
    fs.writeFileSync(path.join(sandboxPath, 'box', file), file_content);
}

const compile = (language, sandboxPath) => {
    const command = languages[language].compile;
    try {
        execSync(command, { cwd: path.join(sandboxPath, 'box') });
        const requirement = languages[language].requirement;
        if (requirement) {
            execSync(requirement, { cwd: path.join(sandboxPath, 'box') });
        }
        return { status: 'OK', message: 'The code was successfully compiled.' };
    } catch (e) {
        return { status: 'ERROR', message: 'The code could not be compiled.', error: check_error(sandboxPath) };
    }
}

const check_error = (sandboxPath) => {
    const error = fs.readFileSync(path.join(sandboxPath, 'box', 'error.txt')).toString();
    return error;
}
const get_cerr = (sandboxPath) => {
    const cerr = fs.readFileSync(path.join(sandboxPath, 'box', 'cerr.txt')).toString();
    return cerr;
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

    fs.writeFileSync(path.join(sandboxPath, 'box', 'error.txt'), '');
    fs.writeFileSync(path.join(sandboxPath, 'box', 'cerr.txt'), '');
    fs.writeFileSync(path.join(sandboxPath, 'box', file), code);
    
    return { sandboxPath, input, output, meta };
}
const read_meta = (sandboxPath) => {
    const meta = fs.readFileSync(path.join(sandboxPath, 'box', 'meta.txt')).toString();
    const metaArray = meta.split('\n');
    const metaObject = {};
    metaArray.forEach((line) => {
        const [key, value] = line.split(':');
        metaObject[key] = value;
    })
    return metaObject;
}
const run = (language, sandboxPath, testCase, inputPath, outputPath, memory, runtime) => {
    const command = languages[language].run;
    
    fs.writeFileSync(inputPath, testCase.input);
    fs.writeFileSync(outputPath, '');
    let exitcode = null, exitsig = null, killed = null, max_rss = null, message = null, status = null, time = null;
    
    try {
        execSync(`isolate --box-id=1 --wait --mem=${memory} --time=${runtime} --meta=${path.join(sandboxPath, 'box', 'meta.txt')} --stderr=cerr.txt --stdin=input.txt --stdout=output.txt --run -- "${command}"`, { cwd: path.join(sandboxPath, 'box') });
    } catch (error) {
        return {
            username,
            code,
            problem,
            language,
            score: 0,
            tests: [],
            fileMemory: get_file_size(sandboxPath, languages[language].file),
            date: new Date(),
            compilationError: null,
            success: false,
            id_solution: idSolution,
            status: 'ERROR' 
        }
    }

    const meta = read_meta(sandboxPath)
    
    exitcode = meta.exitcode ? parseInt(meta.exitcode) : null;
    exitsig = meta.exitsig ? parseInt(meta.exitsig) : null;
    killed = meta.killed ?? null;
    max_rss = meta['max-rss'] ? parseInt(meta['max-rss']) : null;
    message = meta.message ?? null;
    status = meta.status ?? null;
    time = meta.time ? parseFloat(meta.time) : null;
    
    
    const output = fs.readFileSync(outputPath).toString();
    const cerr = fs.readFileSync(path.join(sandboxPath, 'box', 'cerr.txt')).toString()
    
    return { output, exitcode, exitsig, killed, max_rss, message, status, time, cerr };
}

const grader = (testCases, code, problem, username, language, max_time, max_memory) => {
    max_time = parseFloat(max_time);
    max_memory = parseFloat(max_memory);
    const { idSolution, received_time } = initialize();
    const { sandboxPath, input, output, meta } = prepare_sandbox(language, code);
    populate_sandbox(sandboxPath, code, languages[language].file, language);

    const { status, message, error } = compile(language, sandboxPath)
    const results = [];
    let stare = null
    const cerr = get_cerr(sandboxPath)
    if (status === 'ERROR') {
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
            cerr,
            status: 'CE'
        }
    } else {
        testCases.forEach((testCase, index) => {
            const { output: outputResult, exitcode, exitsig, killed, max_rss, message, status, time, cerr } = run(language, sandboxPath, testCase, input, output, max_memory, max_time);
            if (outputResult.trimEnd() === testCase.output.trimEnd() && time <= max_time && max_rss <= max_memory) {
                results.push({
                    status: 'AC',
                    success: true,
                    executionTime: time,
                    memoryUsed: max_rss,
                    score: testCase.score,
                    input: testCase.input,
                    output: outputResult,
                    expectedOutput: testCase.output,
                    exitcode,
                    exitsig,
                    message: 'OK',
                    cerr
                })
                return;
            } else {
                if (exitsig) {
                    results.push({
                        status,
                        success: false,
                        executionTime: time,
                        memoryUsed: max_rss,
                        score: 0,
                        input: testCase.input,
                        output: outputResult,
                        expectedOutput: testCase.output,
                        message: message,
                        exitcode,
                        exitsig,
                        cerr
                    })
                    if (!stare) stare = `Exitsig ${exitsig} on test ${index + 1}`
                    return;
                }
                if (time > max_time && max_rss > max_memory) {
                    results.push({
                        status: 'TLE_MLE',
                        success: false,
                        executionTime: time,
                        memoryUsed: max_rss,
                        score: 0,
                        input: testCase.input,
                        output: outputResult,
                        expectedOutput: testCase.output,
                        message: 'Time Limit Exceeded and Memory Limit Exceeded',
                        exitcode,
                        exitsig,
                        cerr,
                    })
                    if (!stare) stare = `TLE_MLE on test ${index + 1}`
                    return;
                }
                if (time > max_time || message === "Time limit exceeded") {
                    results.push({
                        status,
                        success: false,
                        executionTime: time,
                        memoryUsed: max_rss,
                        score: 0,
                        input: testCase.input,
                        output: outputResult,
                        expectedOutput: testCase.output,
                        message: 'Time Limit Exceeded',
                        exitcode,
                        exitsig,
                        cerr,
                    })
                    if (!stare) stare = `TLE on test ${index + 1}`
                    return;
                }
                if (max_rss > max_memory) {
                    results.push({
                        status,
                        success: false,
                        executionTime: time,
                        memoryUsed: max_rss,
                        score: 0,
                        input: testCase.input,
                        output: outputResult,
                        expectedOutput: testCase.output,
                        message: 'Memory Limit Exceeded',
                        exitcode,
                        exitsig,
                        cerr
                    })
                    if (!stare) stare = `MLE on test ${index + 1}`
                    return;
                }
                if (outputResult !== testCase.output) {
                    results.push({
                        status: 'WA',
                        success: false,
                        executionTime: time,
                        memoryUsed: max_rss,
                        score: 0,
                        input: testCase.input,
                        output: outputResult,
                        expectedOutput: testCase.output,
                        message: 'Wrong Answer',
                        exitcode,
                        exitsig,
                        cerr
                    })
                    if (!stare) stare = `WA on test ${index + 1}`
                    return;
                }
            }
        })
    }

    execSync(`isolate --box-id=1 --cleanup`, { cwd: path.join(sandboxPath, 'box') });

    const success = results.every(test => test.success);
    const score = results.reduce((acc, test) => acc + parseInt(test.score), 0);
    if (!stare) stare = 'Accepted'
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
        status: stare
    }
}

module.exports = { grader };