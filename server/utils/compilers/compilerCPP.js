const fs = require('fs');
const { execSync } = require('child_process');

const compilerCPP = (code, idSolution, language, problem) => {
    fs.mkdirSync(idSolution)
    let query = {}
    switch(language){
        case 'C++':
            query.extension = 'cpp'
            query.cmd = `g++ ${idSolution}/test.cpp -o ./${idSolution}/test 2>&1`
            break;
        case 'C':
           query.extension = 'c'
           query.cmd = `gcc ${idSolution}/test.c -o ./${idSolution}/test 2>&1`
        case 'C#':
            query.extension = 'cs'
            query.cmd = `mcs -out:${idSolution}/test.exe ${idSolution}/test.cs`
        case 'Java':
            query.extension = 'java'
            query.cmd = `javac ./${idSolution}/${problem}.java`    
    }
    let file
    switch(language){
        case 'Java':
            file = `${idSolution}/${problem}.${query.extension}`
            break;
        default:
            file = `${idSolution}/test.${query.extension}`
    }
    fs.writeFileSync(file, code);
    const fileMemory = fs.statSync(file).size;
    try {
        const compilationResult = execSync(query.cmd, {
            encoding: 'utf-8'
        });
        return {
            result: compilationResult,
            memorieFisier: fileMemory,
            status: 1
        }
    } catch (error) {
        return {
            error: error.stdout,
            memorieFisier: fileMemory,
            status: 0
        }
    }
}
module.exports = {compilerCPP}