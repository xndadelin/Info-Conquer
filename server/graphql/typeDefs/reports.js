const {gql} = require('apollo-server-express')
module.exports = gql`
    type Report {
        reporter: String
        _id: ID
        title: String
        description: String
        createdAt: String
    }
`