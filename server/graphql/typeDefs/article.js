const {gql} = require("apollo-server-express");

module.exports = gql`
    """
    Represents an article in the system.
    """
    type Article {
        """
        The unique identifier for the article.
        """
        _id: String
        
        """
        The title of the article.
        """
        title: String
        
        """
        The content of the article.
        """
        content: String
        
        """
        The ID of the user who created the article.
        """
        creator: String
        
        """
        The date and time when the article was created.
        """
        createdAt: String
        
        """
        A list of IDs representing users who liked the article.
        """
        likes: [String]
        
        """
        A list of IDs representing users who disliked the article.
        """
        dislikes: [String]
        
        """
        Indicates whether the current user has liked the article.
        """
        hasLiked: Boolean
        
        """
        Indicates whether the current user has disliked the article.
        """
        hasDisliked: Boolean
        
        """
        A list of tags associated with the article.
        """
        tags: [String]
        
        """
        The date and time when the article was last updated.
        """
        updatedAt: String
        
        """
        A brief excerpt or summary of the article content.
        """
        excerpt: String
    }
`;
