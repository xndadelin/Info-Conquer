const {gql} = require('apollo-server-express');

module.exports = gql`
    type Announcement {
        _id: String
        title: String
        content: String
        createdAt: String
        updatedAt: String
        createdBy: String
    }
`