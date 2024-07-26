const {gql} = require('apollo-server-express');

const typeDefs = gql`
    """
    Represents a simple message with text content.
    """
    type message {
        """
        The content of the message.
        """
        message: String
    }
`;

module.exports = typeDefs;
