const {gql} = require('apollo-server-express');

module.exports = gql`
    """
    Represents an announcement in the system.
    """
    type Announcement {
        """
        The unique identifier for the announcement.
        """
        _id: String
        
        """
        The title of the announcement.
        """
        title: String
        
        """
        The content of the announcement.
        """
        content: String
        
        """
        The date and time when the announcement was created.
        """
        createdAt: String
        
        """
        The date and time when the announcement was last updated.
        """
        updatedAt: String
        
        """
        The username of the user who created the announcement.
        """
        createdBy: String
    }
`;
