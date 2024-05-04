const { gql } = require("apollo-server-express");

module.exports = gql`
    type Contest {
        _id: String
        name: String
        description: String
        startDate: ContestDate
        endDate: ContestDate
        problems: [String]
        languages: [String],
        createdBy: String
    }
    type ContestDate {
        year: Int
        month: Int
        day: Int
        hour: Int
        minute: Int
    }
    input ContestDateInput {
        year: Int
        month: Int
        day: Int
        hour: Int
        minute: Int
    }
`;
