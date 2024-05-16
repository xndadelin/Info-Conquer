const { execSync } = require('child_process');
const {compilerCPP} = require('../compilers/compilerCPP');
const fs = require('fs');
global.crypto = require('crypto')    
const graderCPP = (testCases, code, problem, username, language, max_time, max_memory) => {
    const idSolution = crypto.randomUUID()
    /////////////////////////////////////////////////////////////////////////////
    let codeNameFile = ''
    let extension = ''
    switch(language){
        case 'C++':
            codeNameFile = 'test.cpp'
            extension = 'cpp'
            break;
        case 'C':
            codeNameFile = 'test.c'
            extension = 'c'
            break;
        case 'C#':
            codeNameFile = 'test.cs'
            extension = 'cs'
            break;
        case 'Java':
            codeNameFile = `${problem}.java`
            extension = 'java'
            break;
        case 'Python':
            codeNameFile = 'test.py'
            extension = 'py'
            break;
    }
    /////////////////////////////////////////////////////////////////////////////
    const compilationResult = compilerCPP(code, idSolution, language, problem, codeNameFile, extension, problem);
    if (compilationResult.error) {
        fs.rmdirSync(idSolution, {recursive: true})
        return {
            username,
            code,
            problem,
            language,
            score: 0,
            test: null,
            fileMemory: compilationResult.memorieFisier,
            compilationError: compilationResult.error,
            success: false,
            id_solution: idSolution,
            date: new Date(),
        }
    }else{
        try{
            const testResults = [];
            testCases.forEach(test => {
                fs.writeFileSync(`${idSolution}/input.txt`, test.input);
                fs.writeFileSync(`${idSolution}/expected_output.txt`, test.output);
                let command;
                switch (language) {
                    case 'C++':
                        // time -v does not work, so we use /usr/bin/time -v, change next time
                        command = `docker run -i ${extension}-image /usr/bin/time -v ./program < input.txt > output.txt 2> metrics.txt`;
                        break;
                    case 'C':
                        command = `docker run -i ${extension}-image /usr/bin/time -v ./program < input.txt > output.txt 2> metrics.txt`;
                        break;
                    case 'C#':
                        command = `docker run -i ${extension}-image time ./program.exe < input.txt > output.txt 2> metrics.txt`;
                        break;
                    case 'Java':
                        command = `docker run -i ${extension}-image time java -classpath ./${problem} < input.txt > output.txt 2> metrics.txt`;
                        break;
                }
                try{
                    execSync(command, {cwd: idSolution})
                }catch(error){
                    //catch a signal
                    console.log(error)
                    const metrics = fs.readFileSync(`${idSolution}/metrics.txt`, 'utf-8');
                    const signal = metrics.match(/Command terminated by signal (\d+)/)[1];
                    testResults.push({
                        status: 'RE',
                        success: false,
                        executionTime: 0,
                        memoryUsed: 0,
                        score: 0,
                        input: test.input,
                        output: null,
                        expectedOutput: fs.readFileSync(`${idSolution}/expected_output.txt`, 'utf-8'),
                        signal
                    });
                    return;
                }
                const expectedOutput = fs.readFileSync(`${idSolution}/expected_output.txt`, 'utf-8');
                const actualOutput = fs.readFileSync(`${idSolution}/output.txt`, 'utf-8');
                //get metrics
                const metrics = fs.readFileSync(`${idSolution}/metrics.txt`, 'utf-8');
                const elapsedTimeLine = metrics.match(/Elapsed \(wall clock\) time \(h:mm:ss or m:ss\): ([\d\.:]+)/)[0];
                const elapsedTime = elapsedTimeLine.split(': ').pop()
                const elapsedTimeParts = elapsedTime.split(':').reverse();
                const executionTime = (parseFloat(elapsedTimeParts[0]) + (parseInt(elapsedTimeParts[1] || 0) * 60) + (parseInt(elapsedTimeParts[2] || 0) * 3600)) * 1000;
                const memoryUsed = (metrics.match(/Maximum resident set size \(kbytes\): (\d+)/)[1] )/1024;
                
                if (expectedOutput === actualOutput && executionTime <= max_time && memoryUsed <= max_memory) {
                    testResults.push({
                        status: 'AC',
                        success: true,
                        executionTime,
                        memoryUsed,
                        score: test.score,
                        input: test.input,
                        output: actualOutput,
                        expectedOutput
                    });
                }else{
                    if(executionTime > max_time && memoryUsed > max_memory){
                        testResults.push({
                            status: 'TLE_MLE',
                            success: false,
                            executionTime,
                            memoryUsed,
                            score: 0,
                            input: test.input,
                            output: actualOutput,
                            expectedOutput
                        });
                        return ;
                    }
                    if (executionTime > max_time) {
                        testResults.push({
                            status: 'TLE',
                            success: false,
                            executionTime,
                            memoryUsed,
                            score: 0,
                            input: test.input,
                            output: actualOutput,
                            expectedOutput
                        });
                        return;
                    }
                    if (memoryUsed > max_memory) {
                        testResults.push({
                            status: 'MLE',
                            success: false,
                            executionTime,
                            memoryUsed,
                            score: 0,
                            input: test.input,
                            output: actualOutput,
                            expectedOutput
                        });
                        return;
                    }
                    if (expectedOutput !== actualOutput) {
                        testResults.push({
                            status: 'WA',
                            success: false,
                            executionTime,
                            memoryUsed,
                            score: 0,
                            input: test.input,
                            output: actualOutput,
                            expectedOutput
                        });
                        return ;
                    }
                }
            });
            const success = testResults.every(test => test.success);
            const score = testResults.reduce((acc, test) => acc + parseInt(test.score), 0);
            fs.rmdirSync(idSolution, {recursive: true})
            return {
                username,
                code,
                problem,
                language,
                score,
                tests: testResults,
                fileMemory: compilationResult.memorieFisier,
                date: new Date(),
                compilationError: null,
                success,
                id_solution: idSolution,
            }
        }catch(error){
            fs.rmdirSync(idSolution, {recursive: true}) 
            return {
                username,
                code,
                problem,
                language,
                score: 0,
                tests: null,
                fileMemory: compilationResult.memorieFisier,
                compilationError: error,
                success: false,
                id_solution: idSolution,
                date: new Date()
            }
        }
    }
}
module.exports = {graderCPP}