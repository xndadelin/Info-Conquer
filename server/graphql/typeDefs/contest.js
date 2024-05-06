const { gql } = require("apollo-server-express");

module.exports = gql`
    type Contest {
        _id: String
        name: String
        description: String
        startDate: ContestDate
        endDate: ContestDate
        problems: [Problem]
        languages: [String],
        createdBy: String,
        hasEnded: Boolean,
        hasStarted: Boolean,
        participants: [Participant],
    }
    type ContestDate {
        year: Int
        month: Int
        day: Int
        hour: Int
        minute: Int
    }
    type Problem{
        id: String
        score: String
    }
    input ContestDateInput {
        year: Int
        month: Int
        day: Int
        hour: Int
        minute: Int
    }
    input ProblemInput {
        id: String
        difficulty: String
    }
    type Participant {
        username: String
        score: Int
    }
`;
