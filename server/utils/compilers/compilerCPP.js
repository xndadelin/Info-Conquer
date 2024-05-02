const fs = require('fs');
const { execSync } = require('child_process');
const { generateDockerfile } = require('../generateDockerfile');
const compilerCPP = (code, idSolution, language, _, codeNameFile, extension) => {
    fs.mkdirSync(idSolution)
    generateDockerfile(language, idSolution);
    fs.writeFileSync(`${idSolution}/${codeNameFile}`, code);
    const fileMemory = fs.statSync(`${idSolution}/${codeNameFile}`).size;
    try {
        let compilationResult = null;
        try{
            //built the container => compile the code
            execSync(`docker build --no-cache -t ${extension}-image .`, {cwd: idSolution})
            //check for compilation errorsb
            compilationResult = execSync(`docker run -i ${extension}-image cat compilation_error.txt > ${idSolution}/compilation_error.txt`)
            const compilationError = fs.readFileSync(`${idSolution}/compilation_error.txt`, 'utf-8');
            if(compilationError){
                console.log(compilationError)
                return {
                    error: compilationError,
                    memorieFisier: fileMemory,
                    status: 0
                }
            }else{
                console.log('compilation successful')
            }
        }catch(error){
            return {
                error: 'The docker container could not be created',
                memorieFisier: fileMemory,
                status: 0
            }
        }
        return {
            result: compilationResult,
            memorieFisier: fileMemory,
            status: 1
        }
    } catch (error) {
        console.log(error)
        return {
            error: error.stdout,
            memorieFisier: fileMemory,
            status: 0
        }
    }
}
module.exports = {compilerCPP}