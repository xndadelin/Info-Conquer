const fs = require('fs');
const {execSync} = require('child_process');

const testerCPP = (input, output, punctaj, idSolution) => {
    let executionTime = 0;
    let memoryUsed = 0;
    try{
        execSync(`/usr/bin/time -v ./${idSolution}/test > ${idSolution}/output.txt 2> ${idSolution}/metrics.txt`, {
            input: input,
            encoding: 'utf-8'
        });
    }catch(error){
        return {
            status: error.status,
            success: false,
            executionTime: 0,
            memoryUsed: 0,
            score: 0,
            input,
            output
        }
    }
    const outputTest = fs.readFileSync(`${idSolution}/output.txt`, 'utf-8');
    const success = outputTest.trim() === output.trim();
    const score = success ? punctaj : 0;
    const metrics = fs.readFileSync(`${idSolution}/metrics.txt`, 'utf-8');
    const elapsedTimeLine = metrics.match(/Elapsed \(wall clock\) time \(h:mm:ss or m:ss\): ([\d\.:]+)/)[0];
    const elapsedTime = elapsedTimeLine.split(': ').pop();
    const elapsedTimeParts = elapsedTime.split(':').reverse();
    executionTime = (parseFloat(elapsedTimeParts[0]) + (parseInt(elapsedTimeParts[1] || 0) * 60) + (parseInt(elapsedTimeParts[2] || 0) * 3600)) * 1000;
    memoryUsed = (metrics.match(/Maximum resident set size \(kbytes\): (\d+)/)[1] )/1024;
    return {
        status: 'OK',
        success,
        executionTime,
        memoryUsed,
        score,
        input,
        output
    }

}
module.exports = {testerCPP}