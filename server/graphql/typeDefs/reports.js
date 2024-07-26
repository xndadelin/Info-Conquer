const { gql } = require('apollo-server-express');

module.exports = gql`
    """
    Represents a report created by a user, including details about the report such as the reporter, title, description, and timestamps.
    """
    type Report {
        """
        The username of the person who created the report.
        """
        reporter: String
        
        """
        The unique identifier for the report.
        """
        _id: ID
        
        """
        The title of the report.
        """
        title: String
        
        """
        A detailed description of the report's content or issue.
        """
        description: String
        
        """
        The date and time when the report was created.
        """
        createdAt: String
    }
`;
