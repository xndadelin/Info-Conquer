const {gql} = require('apollo-server-express')

module.exports = gql`
    type Query {
        getUsers: [User]
        getUser : User
        getProblem(title: String!): Problem
    }
`;