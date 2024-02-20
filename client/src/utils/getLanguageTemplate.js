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
        return `class ${problem.getProblem.title} { // please, do not change this
public static void main(String[] args) {
        System.out.println("Hello, World!"); 
    }
}`
        default:
            return null
    }
}