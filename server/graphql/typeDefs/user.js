const { gql } = require('apollo-server-express');

module.exports = gql`
    scalar Date
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
        token: String
    }
    input LoginInput {
        query: String,
        password: String,
        token: String
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
    type LeaderboardRow {
        username: String,
        solvedProblems: Int
    }
    type SearchResults {
        users: [String],
        problems: [String],
        articles: [String],
        contests: [String],
        totalResults: Int,
        announcements: [String]
    },
    type HomepageInfo {
        topProblems: [TopProblem],
        lastSeven: [SubmissionsLast7]
    }
    type SubmissionsLast7 {
        date: String,
        count: Int
    }
    type Activity {
        date: String,
        message: String
    }
`;