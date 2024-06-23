const { gql } = require("apollo-server-express");

module.exports = gql`
    type Contest {
        _id: String
        name: String
        description: String
        startDate: Date
        endDate: Date
        problems: [String]
        languages: [String],
        createdBy: String,
        ended: Boolean,
        started: Boolean,
        participants: [Participant],
    }

    type Participant {
        username: String
        score: Int
        problems: [String]
    }
`;
