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
    }
    type ProfileUser {
        username: String,
        createdAt: String, 
        admin: String,
        solutions: [SolutionProfile],
        solvedProblems: [String]
    }
`;