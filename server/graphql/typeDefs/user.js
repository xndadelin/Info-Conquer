const { gql } = require('apollo-server-express');

module.exports = gql`
    """
    A custom scalar type for representing dates.
    """
    scalar Date

    """
    Represents a user in the system, including details about their account and profile.
    """
    type User {
        """
        The username of the user.
        """
        username: String
        
        """
        The date and time when the user account was created.
        """
        createdAt: String
        
        """
        The email address of the user.
        """
        email: String
        
        """
        Indicates whether the user has admin privileges.
        """
        admin: Boolean
        
        """
        The URL or path to the user's profile picture.
        """
        profilePicture: String
    }

    """
    Input type for registering a new user, including credentials and confirmation token.
    """
    input RegisterInput {
        """
        The username for the new user account.
        """
        username: String
        
        """
        The email address for the new user account.
        """
        email: String
        
        """
        The password for the new user account.
        """
        password: String
        
        """
        Confirmation of the password to ensure correctness.
        """
        confirmPassword: String
        
        """
        A token used for email verification or other registration purposes.
        """
        token: String
    }

    """
    Input type for logging in a user, including credentials and optional token.
    """
    input LoginInput {
        """
        The username or email used to log in.
        """
        query: String
        
        """
        The password for the user account.
        """
        password: String
        
        """
        An optional token for additional authentication or verification.
        """
        token: String
    }

    """
    Represents a user's solution to a problem, including details about the solution's performance and status.
    """
    type SolutionProfile {
        """
        The identifier or title of the problem the solution addresses.
        """
        problem: String
        
        """
        The score achieved for this solution.
        """
        score: String
        
        """
        The date when the solution was submitted.
        """
        date: String
        
        """
        The unique identifier for the solution.
        """
        id_solution: String
        
        """
        Any compilation errors encountered with the solution.
        """
        compilationError: String
        
        """
        The programming language used in the solution.
        """
        language: String
        
        """
        The current status of the solution (e.g., pending, evaluated).
        """
        status: String
        
        """
        The username of the person who submitted the solution.
        """
        username: String
    }

    """
    Represents a problem that has been solved by the user, including the date of solving.
    """
    type solvedProblems {
        """
        The identifier or title of the solved problem.
        """
        problem: String
        
        """
        The date when the problem was solved.
        """
        date: String
    }

    """
    Represents a user's profile information, including their solutions, solved problems, and profile details.
    """
    type ProfileUser {
        """
        The username of the user.
        """
        username: String
        
        """
        The date and time when the user account was created.
        """
        createdAt: String
        
        """
        Indicates whether the user has admin privileges.
        """
        admin: Boolean
        
        """
        A list of solutions submitted by the user.
        """
        solutions: [SolutionProfile]
        
        """
        A list of problems that the user has solved, including dates.
        """
        solvedProblems: [solvedProblems]
        
        """
        The URL or path to the user's profile picture.
        """
        profilePicture: String
        
        """
        A short biography or description about the user.
        """
        bio: String
    }

    """
    Represents a row in the leaderboard, including user details and performance metrics.
    """
    type LeaderboardRow {
        """
        The username of the user in the leaderboard.
        """
        username: String
        
        """
        The number of problems solved by the user.
        """
        solvedProblems: Int
        
        """
        The URL or path to the user's profile picture.
        """
        profilePicture: String
    }

    """
    Represents the results of a search query, including various categories of results.
    """
    type SearchResults {
        """
        A list of users matching the search query.
        """
        users: [String]
        
        """
        A list of problems matching the search query.
        """
        problems: [String]
        
        """
        A list of articles matching the search query.
        """
        articles: [String]
        
        """
        A list of contests matching the search query.
        """
        contests: [String]
        
        """
        The total number of search results.
        """
        totalResults: Int
        
        """
        A list of announcements matching the search query.
        """
        announcements: [String]
    }

    """
    Represents information displayed on the homepage, including top problems and recent submissions.
    """
    type HomepageInfo {
        """
        A list of the top problems to highlight on the homepage.
        """
        topProblems: [TopProblem]
        
        """
        A list of submissions from the last 7 days.
        """
        lastSeven: [SubmissionsLast7]
    }

    """
    Represents the number of submissions for a problem in the last 7 days.
    """
    type SubmissionsLast7 {
        """
        The date of the submission count.
        """
        date: String
        
        """
        The number of submissions made on that date.
        """
        count: Int
    }

    """
    Represents an activity log entry, including the date and a message about the activity.
    """
    type Activity {
        """
        The date and time of the activity.
        """
        date: String
        
        """
        A message describing the activity.
        """
        message: String
    }

    """
    Represents the response from an AI-based editor, including the response content.
    """
    type EditorAiResponse {
        """
        The response generated by the AI editor.
        """
        response: String
    }
`;
