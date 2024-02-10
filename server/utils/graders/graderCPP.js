const {compilerCPP} = require('../compilers/compilerCPP');
const {testerCPP} = require('../testers/testerCPP');
const fs = require('fs');
global.crypto = require('crypto')
const graderCPP = (testCases, code, problem, username, io) => {
    const compilationResult = compilerCPP(code, username);
    let data = new Date().toString().split(' ');
    data = data[0] + ' ' +  data[1] + ' ' + ' ' +  data[2] + ' ' + ' ' + data[3] + ' ' + data[4];
    if (compilationResult.error) {
        fs.rmdirSync(username, {recursive: true});
        return {
            username,
            code,
            problem,
            language: 'cpp',
            io,
            score: 0,
            test: null,
            fileMemory: compilationResult.memorieFisier,
            compilationError: compilationResult.error,
            success: false,
            id_solution: crypto.randomUUID(),
            date:data,
        }
    }else{
        const testResults = [];
        testCases.forEach(test => {
            const testResult = testerCPP(test.input, test.output, test.score, username);
            testResults.push(testResult);
        });
        const success = testResults.every(test => test.success);
        const score = testResults.reduce((acc, test) => acc + parseInt(test.score), 0);
        fs.rmdirSync(username, {recursive: true})
        return {
            username,
            code,
            problem,
            language: 'cpp',
            io,
            score,
            tests: testResults,
            fileMemory: compilationResult.memorieFisier,
            date: data,
            compilationError: null,
            success,
            id_solution: crypto.randomUUID(),
        }
    }
}
module.exports = {graderCPP}