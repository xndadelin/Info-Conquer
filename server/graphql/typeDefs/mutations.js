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
        createContest(name: String, description: String, startDate: ContestDateInput, endDate: ContestDateInput, problems: [ProblemInput], languages: [String]): Response
        joinContest(id: String): Response
        verifyEmail(token: String): Response
        changePassword(password: String, confirmPassword: String): Response
        changeUsername(username: String, newUsername: String): Response
        changeEmail(email: String): Response
    }
`;
