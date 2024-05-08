const { gql } = require('apollo-server-express');

module.exports = gql`
    type User {
        username: String,
        createdAt: String,
        email: String,
        admin: Boolean,
    }
    input RegisterInput {
        username: String,
        email: String,
        password: String,
        confirmPassword: String,
    }
    input LoginInput {
        query: String,
        password: String,
    }
    type SolutionProfile {
        problem: String, 
        score: String, 
        date: String, 
        id_solution: String,
        compilationError: String
        language: String
    }
    type solvedProblems {
        problem: String,
        date: String
    }
    type ProfileUser {
        username: String,
        createdAt: String, 
        admin: String,
        solutions: [SolutionProfile],
        solvedProblems: [solvedProblems]
    }
`;