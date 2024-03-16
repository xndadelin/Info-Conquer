const {gql} = require("apollo-server-express");

module.exports = gql`
    type Article {
        _id: String
        title: String
        content: String
        creator: String
        createdAt: String
        likes: [String]
        dislikes: [String]
        hasLiked: Boolean
        hasDisliked: Boolean
        tags: [String]
        updatedAt: String
    }
`