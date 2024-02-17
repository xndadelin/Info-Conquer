const {gql} = require('apollo-server-express')

module.exports = gql`
      type Reply {
        _id: String,
        creator: String,
        content: String,
        replies: [Reply],
        likes: Int,
        dislikes: Int,
      }
      type ForumPost {
        _id: String
        creator: String,
        content: String,
        category: String,
        replies: [Reply],
        likes: Int, 
        dislikes: Int,
        title: String
      }
`