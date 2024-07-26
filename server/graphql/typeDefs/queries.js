const { gql } = require('apollo-server-express')

module.exports = gql`
    type Query {
        "Get all users"
        getUsers: [User]

        "Get a specific user (requires user identifier)"
        getUser: User
        
        "Get a specific problem by title, with optional contest and daily parameters"
        getProblem(title: String!, contest: String, daily: Date): Problem
        
        "Get the profile of a user by username"
        getProfile(username: String): ProfileUser
        
        "Get a specific solution by its ID"
        getSolution(id: String): Solution
        
        "Get problems filtered by category and subcategory"
        getProblems(category: String, subcategory: String): [Problem]
        
        "Get submissions for a specific problem title"
        getSubmissions(title: String): Submissions
        
        "Get a list of all articles"
        getArticles: [Article]
        
        "Get a specific article by its ID"
        getArticle(id: String): Article
        
        "Get statistics for a specific problem by its ID"
        getProblemStats(id: String): Stats
        
        "Get a specific announcement by its title"
        getAnnouncement(title: String): Announcement
        
        "Get a list of all announcements"
        getAnnouncements: [Announcement]
        
        "Get a list of all solutions"
        getSolutions: [Solution]
        
        "Get a list of all contests"
        getContests: [Contest]
        
        "Get a specific contest by its ID"
        getContest(id: String): Contest
        
        "Get information for the homepage"
        getHomepageInfo: HomepageInfo
        
        "Get the leaderboard"
        getLeaderboard: [LeaderboardRow]
        
        "Search and get results based on the query string"
        getSearch(query: String): SearchResults
        
        "Get activity data for a specific user by username"
        getActivity(username: String): [Activity]
        
        "Get a list of daily problems"
        getDailies: [Daily]
        
        "Get a specific daily problem by date"
        getDaily(daily: String): Daily
    } 
`;  