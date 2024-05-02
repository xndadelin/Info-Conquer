const fs = require('fs');

const generateDockerfile = (language, id) => {
    let dockerfileContent = ''
    switch(language){
        case 'C++':
            dockerfileContent = `FROM gcc:latest
WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y time
RUN touch input.txt
RUN g++ -o program test.cpp 2> compilation_error.txt || true
        `;
        break;
        case 'C':
            dockerfileContent = `FROM gcc:latest
WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y time
RUN touch input.txt
RUN gcc -o program test.c 2> compilation_error.txt || true
        `;
        break;
        case 'C#':
            dockerfileContent = `FROM mono:latest
WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y time
RUN touch input.txt
RUN mcs -out:program.exe test.cs 2> compilation_error.txt || true     
`
    }
    fs.writeFileSync(`${id}/Dockerfile`, dockerfileContent);
}
module.exports = {generateDockerfile}