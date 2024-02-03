const { gql } = require('apollo-server-express');

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
    }
    type Error {
        message: String, 
        code: String
      }
    type Response {
        success: Boolean,
        error: Error
    }
    type Mutation {
        login(loginInput: LoginInput): Response
        register(registerInput: RegisterInput): Response
        logout: Response
    }
`   