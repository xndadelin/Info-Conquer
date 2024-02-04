const { gql } = require('apollo-server-express');
//! Modularize gqls
module.exports = gql`
    type User {
        username: String,
        createdAt: String,
        email: String,
        admin: Boolean,
    }

    input LoginInput {
        query: String,
        password: String,
    }

    input RegisterInput {
        username: String,
        email: String,
        password: String,

    }
    type Query {
        getUsers: [User]
        getUser : User
        getProblem(title: String!): Problem
    }
    type Error {
        message: String, 
        code: String
      }
    type Response {
        success: Boolean,
        error: Error
    }
    input TestInput {
        score: String, 
        input: String,
        output: String
    }
    input ExampleInput {
        input: String,
        output: String,
        explanation: String
    }
    type Example {
        input: String,
        output: String,
        explanation: String
    }
    type Test {
        score: String, 
        input: String,
        output: String
    }
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
    type Mutation {
        login(loginInput: LoginInput): Response
        register(registerInput: RegisterInput): Response
        logout: Response
        createProblem(problemInput: CreateProblemInput) : Response
    }
`   