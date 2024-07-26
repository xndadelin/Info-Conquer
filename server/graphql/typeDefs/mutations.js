const { gql } = require('apollo-server-express');

module.exports = gql`
    """
    Contains various mutations to perform actions in the system.
    """
    type Mutation {
        """
        Log in a user with the provided login input.
        """
        login(loginInput: LoginInput): Response
        
        """
        Register a new user with the provided registration input.
        """
        register(registerInput: RegisterInput): Response
        
        """
        Log out the current user.
        """
        logout: Response
        
        """
        Create a new problem with the provided input details.
        """
        createProblem(problemInput: CreateProblemInput): Response
        
        """
        Submit a solution for a problem with the given solution input.
        """
        submitSolution(solutionInput: SolutionInput): Solution
        
        """
        Publish a new article with the provided details.
        """
        publishArticle(title: String, content: String, tags: [String], type: String, excerpt: String): Response
        
        """
        Like an article identified by its ID.
        """
        likeArticle(id: String): Response
        
        """
        Dislike an article identified by its ID.
        """
        dislikeArticle(id: String): Response
        
        """
        Post a new announcement with the provided title and content.
        """
        postAnnouncement(title: String, content: String): Response
        
        """
        Create a new contest with the specified details.
        """
        createContest(name: String, description: String, startDate: Date, endDate: Date, problems: [String], languages: [String]): Response
        
        """
        Join an existing contest identified by its ID.
        """
        joinContest(id: String): Response
        
        """
        Verify a user's email using the provided verification token.
        """
        verifyEmail(token: String): Response
        
        """
        Change the user's password with the provided current password, new password, and confirmation.
        """
        changePassword(currentpass: String, password: String, confirmPassword: String): Response
        
        """
        Change the user's username from the current username to a new one.
        """
        changeUsername(username: String, newUsername: String): Response
        
        """
        Change the user's email from the current email to a new one.
        """
        changeEmail(email: String, newEmail: String): Response
        
        """
        Rate a problem with a given rating value.
        """
        rateProblem(id: String, rating: Int): Response
        
        """
        Authenticate a user with Discord using the provided authorization code.
        """
        authDiscord(code: String): Response
        
        """
        Create a new report with the provided title, reporter information, description, type, and related problem.
        """
        createReport(title: String, reporter: String, description: String, type: String, problem: String): Response
        
        """
        Get a chatbot message based on a prompt, related problem, and code snippet.
        """
        getChatbotMessage(prompt: String, problem: String, code: String): message
        
        """
        Update the user's profile picture with the provided URL or identifier.
        """
        updateProfilePicture(profilePicture: String): Response
        
        """
        Update the user's bio with the provided text.
        """
        updateBio(bio: String): Response
        
        """
        Request a password reset with the provided email.
        """
        forgotPassword(email: String): Response
        
        """
        Reset the user's password with the new password, confirmation, and verification code.
        """
        resetPassword(password: String, confirmPassword: String, codeForVerification: String): Response
        
        """
        Get a response from an AI editor based on a user's prompt and content.
        """
        getResponseEditorAi(userPrompt: String, content: String): EditorAiResponse
    }
`;
