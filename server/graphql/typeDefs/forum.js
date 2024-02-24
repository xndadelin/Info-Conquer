const {gql} = require('apollo-server-express')

module.exports = gql`
      type Reply {
        creator: String,
        content: String,
        likes: Int,
        dislikes: Int,
        createdAt: String
      }
      type ForumPost {
        _id: String
        creator: String,
        content: String,
        category: String,
        replies: [Reply],
        likes: [String], 
        dislikes: [String],
        title: String
        createdAt: String
        hasLiked: Boolean
        hasDisliked: Boolean
      }
`