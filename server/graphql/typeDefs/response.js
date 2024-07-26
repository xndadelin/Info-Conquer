const { gql } = require('apollo-server-express');

module.exports = gql`
    """
    Represents a standard response format used in various mutations to indicate the outcome of the operation.
    """
    type Response {
        """
        Indicates whether the operation was successful.
        """
        success: Boolean
        
        """
        Contains error details if the operation was not successful.
        """
        error: Error
        
        """
        A message providing additional information about the response.
        """
        message: String
    }

    """
    Represents error details that may be included in a response when an operation fails.
    """
    type Error {
        """
        A description of the error encountered.
        """
        message: String
        
        """
        A code representing the type of error (e.g., validation error, authentication error).
        """
        code: String
    }
`;
