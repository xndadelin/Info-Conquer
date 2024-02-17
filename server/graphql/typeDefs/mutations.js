const {gql} = require('apollo-server-express')

module.exports = gql`
    type Mutation {
        login(loginInput: LoginInput): Response
        register(registerInput: RegisterInput): Response
        logout: Response
        createProblem(problemInput: CreateProblemInput) : Response
        submitSolution(solutionInput: SolutionInput): Solution
        forumPost(content: String, category: String, title: String): Response
    }
`;
