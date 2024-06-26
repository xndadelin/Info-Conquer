const {gql} = require('apollo-server-express')

module.exports = gql`
    type Query {
        getUsers: [User]
        getUser: User
        getProblem(title: String!, contest: String, daily: Date): Problem
        getProfile(username: String): ProfileUser
        getSolution(id: String): Solution
        getProblems(category: String, subcategory: String): [Problem]
        getSubmissions(title: String): Submissions
        getArticles: [Article]
        getArticle(id: String): Article
        getProblemStats(id: String): Stats
        getAnnouncement(title: String): Announcement
        getAnnouncements: [Announcement]
        getSolutions: [Solution]
        getContests: [Contest]
        getContest(id: String): Contest
        getHomepageInfo: HomepageInfo
        getLeaderboard: [LeaderboardRow]
        getSearch(query: String): SearchResults
        getActivity(username: String): [Activity]
        getDailies: [Daily]
        getDaily(daily: String): Daily
    } 
`;  