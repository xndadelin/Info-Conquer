const {gql} = require('apollo-server-express');
const typeDefs = gql`
    type message {
        message: String
    }
`
module.exports = typeDefs;