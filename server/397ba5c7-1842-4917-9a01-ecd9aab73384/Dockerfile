FROM mono:latest
WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y time
RUN touch input.txt
RUN mcs -out:program.exe test.cs 2> compilation_error.txt || true     
