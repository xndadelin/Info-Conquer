const fs = require('fs');
const { execSync } = require('child_process');

const compilerCPP = (code, username) => {
    fs.mkdirSync(username)
    fs.writeFileSync(`${username}/test.cpp`, code);
    const fileMemory = fs.statSync(`${username}/test.cpp`).size;
    try {
        const compilationResult = execSync(`g++ ${username}/test.cpp -o ./${username}/test 2>&1`, {
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