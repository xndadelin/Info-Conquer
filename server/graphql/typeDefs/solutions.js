const {gql} = require('apollo-server-express')

module.exports = gql`
    type Solution {
        username: String,
        code : String,
        problem: String,
        language: String,
        io: String,
        score: String,
        tests: [TestCase],
        fileMemory: String,
        date: String,
        compilationError: String,
        success: String,
        id_solution: String,
        accessToPage: Boolean
    }
    input SolutionInput {
        code: String,
        problem: String,
        language: String
    }
    type TestCase {
        status: String,
        success: String,
        memoryUsed: String,
        executionTime: String,
        score: String,
        input: String,
        output: String,
    }
`;