const {gql} = require('apollo-server-express')

module.exports = gql`
    type Solution {
        username: String,
        code : String,
        problem: String,
        language: String,
        score: Int,
        tests: [TestCase],
        fileMemory: String,
        date: String,
        compilationError: String,
        success: String,
        id_solution: String,
        status: String
    }
    input SolutionInput {
        code: String,
        problem: String,
        language: String,
        type: String
    }
    type TestCase {
        status: String,
        success: String,
        memoryUsed: Float,
        executionTime: Float,
        score: Int,
        input: String,
        output: String,
        expectedOutput: String,
        message: String,
        exitcode: Int,
        exitsig: Int,
        cerr: String
    }
    type Submission {
        username: String,
        problem: String,
        language: String,
        score: Int,
        date: String,
        compilationError: String,
        _id: String,
        status: String
    }
    type Submissions {
        allSolutions: [Submission]
        userSolutions: [Submission]
    }
`;