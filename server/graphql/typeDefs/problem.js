const {gql} = require('apollo-server-express')

module.exports = gql`
    type Problem {
        creator: String, 
        title: String,
        description: String,
        requirements: String,
        type: String, 
        tags: [String], 
        difficulty: String,
        category: String, 
        subcategories: [String],
        input: String,
        output: String,
        tests: [Test],
        timeExecution: String,
        limitMemory: String,
        examples: [Example],
        indications: String,
        languages: [String]
    }
    input CreateProblemInput {
        creator: String, 
        title: String,
        description: String,
        requirements: String,
        type: String, 
        tags: [String], 
        difficulty: String,
        category: String, 
        subcategories: [String],
        input: String,
        output: String,
        tests: [TestInput],
        timeExecution: String,
        limitMemory: String,
        examples: [ExampleInput],
        indications: String,
        languages: [String],
        inputFile: String,
        outputFile: String  
    }
    type Test {
        score: String, 
        input: String,
        output: String
    }
    input TestInput {
        score: String, 
        input: String,
        output: String
    }
    type Example {
        input: String,
        output: String,
        explanation: String
    }
    input ExampleInput {
        input: String,
        output: String,
        explanation: String
    }
`;