const {gql} = require('apollo-server-express')

module.exports = gql`
    type Query {
        getUsers: [User]
        getUser: User
        getProblem(title: String!): Problem
        getProfile(username: String): ProfileUser
        getSolution(id: String): Solution
        getProblems(category: String, subcategory: String): [Problem]
        getForumPosts: [ForumPost]
        getForumPost(id: String): ForumPost
        getSubmissions(title: String): [Submission]
        getArticles: [Article]
        getArticle(id: String): Article
        getTop10Submissions(id: String): [top10Submissions]
    }
`;  