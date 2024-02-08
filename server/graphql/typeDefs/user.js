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
`;