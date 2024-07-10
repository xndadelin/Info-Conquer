import { gql } from '@apollo/client';
export const GET_ANNOUNCEMENT = gql`
query getAnnouncement($title: String) {
    getAnnouncement(title: $title) {
        title
        content
        createdBy
    }
}
`;
export const GET_ARTICLE = gql`
    query GetArticle($id: String) {
        getArticle(id: $id) {
            content
            createdAt
            creator
            hasDisliked
            dislikes
            hasLiked
            likes
            title
            tags
            updatedAt
        }
    }
`
export const LIKE_ARTICLE = gql`
    mutation LikeArticle($id: String) {
        likeArticle(id: $id) {
            success
        }
    }
`
export const DISLIKE_ARTICLE = gql`
    mutation DislikeArticle($id: String) {
        dislikeArticle(id: $id) {
            success
        }
    }
`
export const AUTH_DISCORD = gql`
mutation AuthDiscord($code: String!) {
    authDiscord(code: $code) {
        success
        message
    }
}
`
export const GET_CONTEST = gql`
query GetContest($id: String) {
    getContest(id: $id) {
        description
        endDate
        languages
        name
        startDate
        createdBy
        problems {
            id
            category
            difficulty
            subcategories
        }
        participants {
            username
            score
            problems {
                id
                score
            }
        }
        started 
        ended
    }
}
`;
export const EDIT_ARTICLE = gql`
    mutation EditArticle($id: String, $content: String, $tags: [String], $title: String) {
        editArticle(id: $id, content: $content, tags: $tags, title: $title) {
            success
        }
    }
`;
export const LOGOUT = gql`
mutation {
    logout {
        success
    }
}
`;
export const GET_PROBLEM = gql`
query GetProblem($title: String!, $contest: String, $daily: Date) {
    getProblem(title: $title, contest: $contest, daily: $daily) {
        title
        creator
        description
        requirements
        tags
        category
        difficulty
        subcategories
        input
        output
        timeExecution
        limitMemory
        examples {
            input
            explanation
            output
        }
        indications
        languages
        restriction
        successRate
        userHasRated
        rating
        contest
    }
}
`
export const SUBMIT_SOLUTION = gql`
mutation ($solutionInput: SolutionInput) {
    submitSolution(solutionInput: $solutionInput) {
        username
        code
        language
        problem
        io
        score
        tests {
            success
            status
            memoryUsed
            executionTime
            score
            input
            output
            message
            exitcode
            exitsig
        }
        date
        fileMemory
        compilationError
        success
        id_solution
    }
}
`
export const GET_SUBMISSIONS = gql`
query GetSubmissions($title: String) {
    getSubmissions(title: $title) {
        allSolutions {
            status
            date
            language
            problem
            score
            username
            status
        }
        userSolutions {
            status
            date
            language
            problem
            score
            username
            _id
        }
    }
}
`
export const GET_CHATBOT_RESPONSE = gql`
mutation GetChatbotMessage($prompt: String, $problem: String, $code: String) {
    getChatbotMessage(prompt: $prompt, problem: $problem, code: $code) {
        message
    }
}
`
export const GET_PROBLEMS = gql`
query GetProblems($category: String, $subcategory: String) {
  getProblems(category: $category, subcategory: $subcategory) {
    category
    creator
    description
    difficulty
    type
    title
    subcategories
  }
}
`;
export const GET_STATS = gql`
query GetProblemStats($id: String) {
    getProblemStats(id: $id) {
        bestMemory {
            language
            date
            memory
            username
        }
        firstSubmissions {
            date
            language
            _id
        }
        timeExecution {
            date
            language
            timeExecutions
            username
        }
        solves {
            count
            date
        }
    }
}
`
export const GET_PROFILE = gql`
query GetProfile($username: String){
    getProfile(username: $username){
        username
        createdAt
        admin
        profilePicture
        solutions {
            problem
            score
            date
            compilationError,
            id_solution
            language
            status
            username
        }
        bio
        solvedProblems {
            problem
        }
    }
}
`

export const UPDATE_USERNAME = gql`
mutation changeUsername($username: String, $newUsername: String){
    changeUsername(username: $username, newUsername: $newUsername){
        success
    }
}`

export const UPDATE_EMAIL = gql`
mutation changeEmail($email: String, $newEmail: String){
    changeEmail(email: $email, newEmail: $newEmail){
        success
    }
}`

export const CHANGE_PASSWORD = gql`
mutation changePassword($currentpass: String, $password: String, $confirmPassword: String){
    changePassword(currentpass: $currentpass, password: $password, confirmPassword: $confirmPassword){
        success
    }

}`

export const GET_ACTIVITY = gql`
query getActivity($username: String){
    getActivity(username: $username) {
        date
        message
    }
}
`
export const UPDATE_PROFILE_PICTURE = gql`
mutation updateProfilePicture($profilePicture: String){
    updateProfilePicture(profilePicture: $profilePicture){
        success
    }
}
`
export const UPDATE_BIO = gql`
mutation updateBio($bio: String){
    updateBio(bio: $bio){
        success
    }
}
`
export const RATE_PROBLEM = gql`
mutation rateProblem($id: String!, $rating: Int!) {
    rateProblem(id: $id, rating: $rating) {
        success
    }
}
`;
export const REPORT_PROBLEM = gql`
mutation createReport($title: String!, $reporter: String!, $description: String!, $type: String!, $problem: String!) {
    createReport(title: $title, reporter: $reporter, description: $description, type: $type, problem: $problem) {
        success
    }
}
`;
export const RESET_PASSWORD = gql`
    mutation ResetPassword($password: String!, $confirmPassword: String!, $codeForVerification: String!) {
        resetPassword(password: $password, confirmPassword: $confirmPassword, codeForVerification: $codeForVerification) {
            success
        }
    }
`
export const SEARCH = gql`
  query GetSearch($query: String) {
    getSearch(query: $query) {
      users
      problems
      articles
      contests
      totalResults
    }
  }
`;
export const GET_SOLUTION = gql`
query GetSolution($id: String){
    getSolution(id: $id){
        code
        compilationError
        date
        fileMemory
        id_solution
        language
        problem
        score
        success
        tests {
          executionTime
          input
          memoryUsed
          score
          output
          status
          success
          expectedOutput
          cerr
        }
        username
    }
}
`;
export const VERIFY_TOKEN = gql`
mutation verifyEmail($token: String){
    verifyEmail(token: $token){
        success
    }
}
`
export const GET_USER = gql`
query{
    getUser {
        username,
        createdAt,
        email,
        admin
        profilePicture
    }
}
`
export const GET_ARTICLES = gql`
query getArticles {
    getArticles {
        _id
        createdAt
        creator
        dislikes
        likes
        title
    }
}
`;
export const GET_DAILIES = gql`
query GetDailies {
    getDailies {
        problem
        date
        solved
    }
}
`;
export const GET_CONTESTS = gql`
    query GetContests {
        getContests {
            _id
            description
            endDate
            languages
            name
            startDate
            createdBy
            ended
            started
            hasJoined
        }
    }
`;
export const JOIN_CONTEST = gql`
    mutation JoinContest($id: String!) {
        joinContest(id: $id) {
            success
        }
    }
`;
export const GET_PROBLEMS_TITLE = gql`
query GetProblems($category: String, $subcategory: String){
    getProblems(category: $category, subcategory: $subcategory){
        title
    }
}`
export const CREATE_CONTEST = gql`
mutation CreateContest($name: String, $description: String, $startDate: Date, $endDate: Date, $problems: [String], $languages: [String]) {
    createContest(name: $name, description: $description, startDate: $startDate, endDate: $endDate, problems: $problems, languages: $languages) {
        success
    }
}
`;

export const FORGOT_PASSWORD = gql`
mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
        success
    }
}
`
export const GET_ANNOUNCEMENTS = gql`
query getAnnouncements {
    getAnnouncements {
        title
        content
        createdBy
    }
}`
export const GET_HOMEPAGE_INFO = gql`
query getHomepageInfo {
    getHomepageInfo {
        topProblems {
            title
            difficulty
            successRate
        }
        lastSeven {
            date
            count
        }
    }
}
`
export const GET_LEADERBOARD = gql`
query getLeaderboard {
    getLeaderboard {
        username
        solvedProblems
        profilePicture
    }
}
`;
export const LOGIN = gql`
mutation Login($query: String!, $password: String!, $token: String!) {
    login(loginInput: { query: $query, password: $password, token: $token }) {
        success
        error {
            code
            message
        }
    }
}
`;
export const POST_ANNOUNCEMENT = gql`
mutation postAnnouncement($title: String, $content: String) {
    postAnnouncement(title: $title, content: $content) {
        success
    }
}
`
export const PUBLISH_ARTICLE = gql`
mutation PublishArticle($title: String, $content: String, $tags: [String]) {
    publishArticle(title: $title, content: $content, tags: $tags) {
        success
    }
}
`;
export const CREATE_PROBLEM = gql`
mutation CreateProblem($title: String, $description: String, $requirements: String, $type: String, $tags: [String], $difficulty: String, $category: String, $subcategories: [String], $input: String, $output: String, $tests: [TestInput], $timeExecution: Float, $limitMemory: Float, $examples: [ExampleInput], $indications: String, $languages: [String], $restriction: String, $itsForContest: Boolean) {
    createProblem(problemInput: {title: $title, description: $description, requirements: $requirements, type: $type, tags: $tags, difficulty: $difficulty, category: $category, subcategories: $subcategories, input: $input, output: $output, tests: $tests, timeExecution: $timeExecution, limitMemory: $limitMemory, examples: $examples, indications: $indications, languages: $languages, restriction: $restriction, itsForContest: $itsForContest}) {
    success
    error {
        message
        code
    }
    }
}
`
export const REGISTER = gql`
mutation Register($username: String!, $email: String!, $password: String!, $confirmPassword: String!, $token: String!) {
    register(registerInput: {username: $username, password: $password, email: $email, confirmPassword: $confirmPassword, token: $token}) {
        success
        error {
            code
            message
        }
    }
}
`;