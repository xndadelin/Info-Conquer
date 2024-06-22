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
        limitMemory: Int,
        examples: [Example],
        indications: String,
        languages: [String],
        restriction: String,
        itsForContest: Boolean,
        successRate: Float,
        userHasRated: Boolean,
        rating: Int
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
        limitMemory: Int,
        examples: [ExampleInput],
        indications: String,
        languages: [String],
        inputFile: String,
        outputFile: String,
        restriction: String,
        itsForContest: Boolean,
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
    type firstSubmissions {
        username: String,
        date: String,
        language: String,
        _id: String
    }
    type timeExecution {
        username: String,
        date: String,
        language: String,
        timeExecutions: Float,
    }
    type bestMemory {
        username: String,
        date: String,
        language: String,
        memory: Float,
    }
    type solve {
        date: String,
        count: Int,
    }
    type Stats {
        firstSubmissions: [firstSubmissions],
        timeExecution: [timeExecution],
        bestMemory: [bestMemory]
        solves: [solve]
    }
    type TopProblem {
        title: String,
        difficulty: String,
        tags: [String],
        successRate: String,
    }
`;
