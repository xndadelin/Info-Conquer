const {compilerCPP} = require('../compilers/compilerCPP');
const {testerCPP} = require('../testers/testerCPP');
const fs = require('fs');
global.crypto = require('crypto')
//to do: organise lmao
const graderCPP = (testCases, code, problem, username, io, language) => {
    console.log(username)
    const idSolution = crypto.randomUUID()
    const compilationResult = compilerCPP(code, idSolution, language);
    let data = new Date().toString().split(' ');
    data = data[0] + ' ' +  data[1] + ' ' + ' ' +  data[2] + ' ' + ' ' + data[3] + ' ' + data[4];
    if (compilationResult.error) {
        fs.rmdirSync(idSolution, {recursive: true});
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
            date:data,
        }
    }else{
        const testResults = [];
        testCases.forEach(test => {
            const testResult = testerCPP(test.input, test.output, test.score, idSolution, language);
            testResults.push(testResult);
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
            date: data,
            compilationError: null,
            success,
            id_solution: idSolution,
        }
    }
}
module.exports = {graderCPP}