export const getTemplate = (language, problem) => {
    switch(language){
        case 'C++':
            return `#include <iostream>

int main(){
    std::cout << "Hello world!";
    return 0;
}`
        case 'C':
            return `#include <stdio.h>
int main() {
    printf("Hello world!");
    return 0;
}`
        case 'C#':
            return `namespace ${problem.getProblem.title}
{
    class Hello {         
        static void Main(string[] args)
        {
            System.Console.WriteLine("Hello World!");
        }
    }
}            
`
        case 'Java':
        return `class Main {
public static void main(String[] args) {
        System.out.println("Hello, World!"); 
    }
}`
        case 'Python':
            return `#!/usr/bin/env python3
print("Hello world!")`
        case 'Javascript':
            return `#!/usr/bin/env node
console.log("Hello world!")`
        default:
            return null
    }
}