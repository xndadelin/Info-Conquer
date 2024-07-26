const { gql } = require("apollo-server-express");

module.exports = gql`
    """
    Represents a contest with various details and related information.
    """
    type Contest {
        """
        The unique identifier for the contest.
        """
        _id: String
        
        """
        The name of the contest.
        """
        name: String
        
        """
        A description of the contest.
        """
        description: String
        
        """
        The start date and time of the contest.
        """
        startDate: Date
        
        """
        The end date and time of the contest.
        """
        endDate: Date
        
        """
        A list of problems associated with the contest.
        """
        problems: [ProblemContest]
        
        """
        A list of programming languages that can be used in the contest.
        """
        languages: [String]
        
        """
        The ID of the user who created the contest.
        """
        createdBy: String
        
        """
        Indicates whether the contest has ended.
        """
        ended: Boolean
        
        """
        Indicates whether the contest has started.
        """
        started: Boolean
        
        """
        A list of participants in the contest.
        """
        participants: [Participant]
        
        """
        Indicates whether the current user has joined the contest.
        """
        hasJoined: Boolean
    }

    """
    Represents a participant in a contest.
    """
    type Participant {
        """
        The username of the participant.
        """
        username: String
        
        """
        The score of the participant in the contest.
        """
        score: Int
        
        """
        A list of problems the participant has worked on in the contest.
        """
        problems: [ProblemContest]
    }

    """
    Represents a problem within a contest.
    """
    type ProblemContest {
        """
        The unique identifier for the problem.
        """
        id: String
        
        """
        The score assigned to the problem in the contest.
        """
        score: Int
        
        """
        The category of the problem.
        """
        category: String
        
        """
        The difficulty level of the problem.
        """
        difficulty: String
        
        """
        A list of subcategories related to the problem.
        """
        subcategories: [String]
    }
`;