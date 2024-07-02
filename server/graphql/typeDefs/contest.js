const { gql } = require("apollo-server-express");

module.exports = gql`
    type Contest {
        _id: String
        name: String
        description: String
        startDate: Date
        endDate: Date
        problems: [ProblemContest]
        languages: [String],
        createdBy: String,
        ended: Boolean,
        started: Boolean,
        participants: [Participant],
        hasJoined: Boolean
    }

    type Participant {
        username: String
        score: Int
        problems: [ProblemContest]
    }
    type ProblemContest {
        id: String, 
        score: Int,
        category: String,
        difficulty: String,
        subcategories: [String]
    }
`;
