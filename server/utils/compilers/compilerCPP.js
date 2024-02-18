const fs = require('fs');
const { execSync } = require('child_process');

const compilerCPP = (code, idSolution, language) => {
    fs.mkdirSync(idSolution)
    let languageType = {
        extension: null,
        command: null,
    };
    switch(language){
        case 'C++':
            languageType.extension = 'cpp'
            language.command = '/usr/bin/g++'
            break;
        case 'C':
            languageType.extension = 'c'
            languageType.command = '/usr/bin/gcc'
    }
    fs.writeFileSync(`${idSolution}/test.${languageType.extension}`, code);
    const fileMemory = fs.statSync(`${idSolution}/test.${languageType.extension}`).size;
    try {
        const compilationResult = execSync(`${languageType.command} ${idSolution}/test.${languageType.extension} -o ./${idSolution}/test 2>&1`, {
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