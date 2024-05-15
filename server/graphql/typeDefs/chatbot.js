const {gql} = require('apollo-server-express');
const typeDefs = gql`
    type message {
        message: String
    }
    type Mutation {
        getChatbotMessage(prompt: String, problem: String, code: String): message
    }
`
module.exports = typeDefs;