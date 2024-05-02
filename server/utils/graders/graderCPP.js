const { execSync } = require('child_process');
const {compilerCPP} = require('../compilers/compilerCPP');
const fs = require('fs');
global.crypto = require('crypto')    
const graderCPP = (testCases, code, problem, username, io, language) => {
    const idSolution = crypto.randomUUID()
    const compilationResult = compilerCPP(code, idSolution, language, problem);
    if (compilationResult.error) {
        fs.rmdirSync(idSolution, {recursive: true})
        return {
            username,
            code,
            problem,
            language,
            io,
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

                try{
                    execSync("docker run -i cpp-image time -v ./program < input.txt > output.txt 2> metrics.txt", { cwd: idSolution });
                }catch(error){
                    //catch a signal
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
                
                if (expectedOutput === actualOutput) {
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
                io,
                score,
                tests: testResults,
                fileMemory: compilationResult.memorieFisier,
                date: new Date(),
                compilationError: null,
                success,
                id_solution: idSolution,
            }
        }catch(error){
            return {
                username,
                code,
                problem,
                language,
                io,
                score: 0,
                tests: null,
                fileMemory: compilationResult.memorieFisier,
                compilationError: error,
                success: false,
                id_solution: idSolution,
                date: new Date(),
            }
        }
        
        /* fs.rmdirSync(idSolution, {recursive: true})
        return {
            username,
            code,
            problem,
            language,
            io,
            score,
            tests: testResults,
            fileMemory: compilationResult.memorieFisier,
            date: new Date(),
            compilationError: null,
            success,
            id_solution: idSolution,
        } */
    }
}
module.exports = {graderCPP}