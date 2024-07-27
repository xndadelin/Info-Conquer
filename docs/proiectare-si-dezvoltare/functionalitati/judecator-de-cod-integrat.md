---
description: >-
  Cu ajutorul sandboxului Isolate, dezvoltat de Martin Mareš (mj@ucw.cz) si
  Bernard Blackham (bernard@blackham.com.au) pentru sisteme de concursuri. De
  exemplu, este folosit si la IOI.
---

# ℹ️ Judecător de cod integrat

* 🤖 Evaluează automat soluțiile trimise de utilizatori, oferind feedback instantaneu și detaliat pe baza testelor predefinite
* 🛡️ Folosește un sandbox securizat, care este utilizat si la IOI (Internațional Olympiad în Informatics)
* 🔗 Mai multe detalii: [GitHub - ioi/isolate](https://github.com/ioi/isolate), [http://www.ucw.cz/moe/isolate.1.html](http://www.ucw.cz/moe/isolate.1.html), [https://mj.ucw.cz/papers/secgrad.pdf](https://mj.ucw.cz/papers/secgrad.pdf), [https://mj.ucw.cz/papers/isolate.pdf](https://mj.ucw.cz/papers/isolate.pdf)

```javascript
execSync(`isolate 
    --box-id=1 
    --wait // nu pot exista doua instante de isolate 
          // => nu este necesara implementarea unei cozi
    --mem=${memory} 
    --time=${runtime} 
    --meta=${path.join(sandboxPath, 'box', 'meta.txt')} 
    --stderr=cerr.txt 
    --stdin=input.txt 
    --stdout=output.txt 
    --run -- "${command}"`, 
{ cwd: path.join(sandboxPath, 'box') });
```

## Compilare si rularea programelor oferite de utilizatori

<details>

<summary><strong>C++</strong></summary>

* **Compile:** `g++ -O2 -o main main.cpp -Wall 2> error.txt`
* **Extension:** `cpp`
* **Run:** `./main`
* **File:** `main.cpp`

</details>

<details>

<summary><strong>C</strong></summary>

* **Compile:** `gcc -O2 -o main main.c -Wall 2> error.txt`
* **Extension:** `c`
* **Run:** `./main`
* **File:** `main.c`

</details>

<details>

<summary><strong>C#</strong></summary>

* **Compile:** `dotnet new console -o main && cp main.cs main/Program.cs && cd main && dotnet build -c Release 2> error.txt && cd .. && cp -r main/bin/Release/net8.0/ /var/local/lib/isolate/1/box/program`
* **Extension:** `cs`
* **Run:** `./program/main`
* **File:** `main.cs`

</details>

<details>

<summary><strong>Java</strong></summary>

* **Compile:** `javac Main.java 2> error.txt`
* **Extension:** `java`
* **Run:** `./Main.jar`
* **File:** `Main.java`
* **Requirement:** `touch MANIFEST.MF && echo "Main-Class: Main \nJVM-Args: -Xmx4g -Xms2g" > MANIFEST.MF && jar cfm Main.jar MANIFEST.MF Main.class && chmod +x Main.jar`

</details>

<details>

<summary><strong>Python</strong></summary>

* **Compile:** `python3 -m py_compile main.py 2> error.txt`
* **Extension:** `py`
* **Run:** `./main.py`
* **File:** `main.py`
* **Requirement:** `chmod +x main.py`
* **Shebang:** `#!/usr/bin/env python3`

</details>

<details>

<summary><strong>JavaScript</strong></summary>

* **Compile:** `node main.js > /dev/null 2> error.txt`
* **Extension:** `js`
* **Run:** `./main.js`
* **File:** `main.js`
* **Requirement:** `chmod +x main.js`
* **Shebang:** `#!/usr/bin/env node`

</details>

<details>

<summary><strong>Ruby</strong></summary>

* **Compile:** `ruby -c main.rb 2> error.txt`
* **Extension:** `rb`
* **Run:** `ruby main.rb`
* **File:** `main.rb`

</details>

<details>

<summary><strong>Rust</strong></summary>

* **Compile:** `rustc main.rs 2> error.txt`
* **Extension:** `rs`
* **Run:** `./main`
* **File:** `main.rs`

</details>

<details>

<summary><strong>Go</strong></summary>

* **Compile:** `go build main.go 2> error.txt && go mod init main`
* **Extension:** `go`
* **Run:** `./main`
* **File:** `main.go`

</details>

<details>

<summary><strong>PHP</strong></summary>

* **Compile:** `php -l main.php 2> error.txt`
* **Extension:** `php`
* **Run:** `./main.php`
* **File:** `main.php`
* **Shebang:** `#!/usr/bin/env php`
* **Requirement:** `chmod +x main.php`

</details>
