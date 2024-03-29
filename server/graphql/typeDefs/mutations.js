const {gql} = require('apollo-server-express')

module.exports = gql`
    type Mutation {
        login(loginInput: LoginInput): Response
        register(registerInput: RegisterInput): Response
        logout: Response
        createProblem(problemInput: CreateProblemInput) : Response
        submitSolution(solutionInput: SolutionInput): Solution
        publishArticle(title: String, content: String, tags: [String]): Response
        likeArticle(id: String): Response
        dislikeArticle(id: String): Response
        editArticle(id: String, content: String, tags: [String], title: String): Response
        postAnnouncement(title: String, content: String): Response
    }
`;
