const {gql} = require('apollo-server-express')

module.exports = gql`
    type Response {
        success: Boolean,
        error: Error,
        message: String
    }
    type Error {
        message: String, 
        code: String
    }
`;
