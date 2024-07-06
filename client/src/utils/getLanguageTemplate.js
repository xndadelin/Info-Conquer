export const getTemplate = (language) => {
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
            return `namespace Main
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
            return `print("Hello world!")`
        case 'Javascript':
            return `console.log("Hello world!")`
        case 'Ruby':
            return `puts "Hello world!"`
        case 'Go':
            return `package main
import "fmt"
func main() {
    fmt.Println("Hello, World!")
}`
        case 'Rust':
            return `fn main() {
    println!("Hello, World!");
}`
        case 'Swift':
            return `import Swift
print("Hello, World!")`
        case 'Kotlin':
            return `fun main() {
    println("Hello, World!")
}`
        case 'PHP':
            return `<?php
    echo "Hello, World!";
?>`
        case 'Perl':
            return `print "Hello, World!\n";`
        case 'Scala':
            return `object Main extends App {
    println("Hello, World!")
}`
        default:
            return 'Write your code here'
    }
}