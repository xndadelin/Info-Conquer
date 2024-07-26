const { gql } = require('apollo-server-express');

module.exports = gql`
    """
    Represents a problem in the system with various attributes and details.
    """
    type Problem {
        """
        The username of the user who created the problem.
        """
        creator: String
        
        """
        The title of the problem.
        """
        title: String
        
        """
        A description of the problem.
        """
        description: String
        
        """
        The requirements or constraints for solving the problem.
        """
        requirements: String
        
        """
        The type of the problem (e.g., algorithm, data structure).
        """
        type: String
        
        """
        A list of tags associated with the problem for categorization.
        """
        tags: [String]
        
        """
        The difficulty level of the problem (e.g., easy, medium, hard).
        """
        difficulty: String
        
        """
        The category of the problem.
        """
        category: String
        
        """
        A list of subcategories related to the problem.
        """
        subcategories: [String]
        
        """
        The input format required for the problem.
        """
        input: String
        
        """
        The expected output format for the problem.
        """
        output: String
        
        """
        A list of test cases for the problem.
        """
        tests: [Test]
        
        """
        The time execution limit for solving the problem.
        """
        timeExecution: Float
        
        """
        The memory limit for solving the problem.
        """
        limitMemory: Float
        
        """
        A list of examples demonstrating the problem.
        """
        examples: [Example]
        
        """
        Additional indications or hints for solving the problem.
        """
        indications: String
        
        """
        A list of programming languages supported for solving the problem.
        """
        languages: [String]
        
        """
        Any restrictions or constraints related to the problem.
        """
        restriction: String
        
        """
        Indicates whether the problem is intended for a contest.
        """
        itsForContest: Boolean
        
        """
        The success rate of users solving the problem.
        """
        successRate: Float
        
        """
        Indicates whether the current user has rated the problem.
        """
        userHasRated: Boolean
        
        """
        The average rating given to the problem.
        """
        rating: Float
        
        """
        The ID of the contest (if applicable) associated with the problem.
        """
        contest: String
    }

    """
    Input type for creating a new problem with required details.
    """
    input CreateProblemInput {
        """
        The username of the user creating the problem.
        """
        creator: String
        
        """
        The title of the problem.
        """
        title: String
        
        """
        A description of the problem.
        """
        description: String
        
        """
        The requirements or constraints for solving the problem.
        """
        requirements: String
        
        """
        The type of the problem (e.g., algorithm, data structure).
        """
        type: String
        
        """
        A list of tags associated with the problem.
        """
        tags: [String]
        
        """
        The difficulty level of the problem.
        """
        difficulty: String
        
        """
        The category of the problem.
        """
        category: String
        
        """
        A list of subcategories related to the problem.
        """
        subcategories: [String]
        
        """
        The input format required for the problem.
        """
        input: String
        
        """
        The expected output format for the problem.
        """
        output: String
        
        """
        A list of test cases for the problem.
        """
        tests: [TestInput]
        
        """
        The time execution limit for solving the problem.
        """
        timeExecution: Float
        
        """
        The memory limit for solving the problem.
        """
        limitMemory: Float
        
        """
        A list of examples demonstrating the problem.
        """
        examples: [ExampleInput]
        
        """
        Additional indications or hints for solving the problem.
        """
        indications: String
        
        """
        A list of programming languages supported for solving the problem.
        """
        languages: [String]
        
        """
        Any restrictions or constraints related to the problem.
        """
        restriction: String
        
        """
        Indicates whether the problem is intended for a contest.
        """
        itsForContest: Boolean
    }

    """
    Represents a test case for a problem, including its score, input, and output.
    """
    type Test {
        """
        The score assigned to this test case.
        """
        score: Float
        
        """
        The input data for the test case.
        """
        input: String
        
        """
        The expected output for the test case.
        """
        output: String
    }

    """
    Input type for providing test case details when creating a problem.
    """
    input TestInput {
        """
        The score assigned to this test case.
        """
        score: Float
        
        """
        The input data for the test case.
        """
        input: String
        
        """
        The expected output for the test case.
        """
        output: String
        
        """
        The number or identifier for this test case.
        """
        number: String
    }

    """
    Represents an example demonstrating the problem, including input, output, and explanation.
    """
    type Example {
        """
        The input data for the example.
        """
        input: String
        
        """
        The expected output for the example.
        """
        output: String
        
        """
        An explanation of the example.
        """
        explanation: String
    }

    """
    Input type for providing example details when creating a problem.
    """
    input ExampleInput {
        """
        The input data for the example.
        """
        input: String
        
        """
        The expected output for the example.
        """
        output: String
        
        """
        An explanation of the example.
        """
        explanation: String
    }

    """
    Represents the first submission for a problem, including the username, date, language, and submission ID.
    """
    type firstSubmissions {
        """
        The username of the user who made the first submission.
        """
        username: String
        
        """
        The date of the first submission.
        """
        date: String
        
        """
        The programming language used for the first submission.
        """
        language: String
        
        """
        The unique ID of the first submission.
        """
        _id: String
    }

    """
    Represents time execution data for a problem, including the username, date, language, and time executions.
    """
    type timeExecution {
        """
        The username of the user who made the submission.
        """
        username: String
        
        """
        The date of the submission.
        """
        date: String
        
        """
        The programming language used for the submission.
        """
        language: String
        
        """
        The time execution for the problem in seconds.
        """
        timeExecutions: Float
    }

    """
    Represents memory usage data for a problem, including the username, date, language, and memory usage.
    """
    type bestMemory {
        """
        The username of the user who made the submission.
        """
        username: String
        
        """
        The date of the submission.
        """
        date: String
        
        """
        The programming language used for the submission.
        """
        language: String
        
        """
        The memory usage for the problem in megabytes.
        """
        memory: Float
    }

    """
    Represents the number of solves for a problem on a specific date.
    """
    type solve {
        """
        The date of the solves.
        """
        date: String
        
        """
        The count of solves on that date.
        """
        count: Int
    }

    """
    Represents statistics for a problem, including first submissions, time execution, best memory, and solve counts.
    """
    type Stats {
        """
        A list of first submissions for the problem.
        """
        firstSubmissions: [firstSubmissions]
        
        """
        A list of time execution data for the problem.
        """
        timeExecution: [timeExecution]
        
        """
        A list of best memory usage data for the problem.
        """
        bestMemory: [bestMemory]
        
        """
        A list of solve counts for the problem.
        """
        solves: [solve]
    }

    """
    Represents a top problem with key details such as title, difficulty, tags, and success rate.
    """
    type TopProblem {
        """
        The title of the top problem.
        """
        title: String
        
        """
        The difficulty level of the top problem.
        """
        difficulty: String
        
        """
        A list of tags associated with the top problem.
        """
        tags: [String]
        
        """
        The success rate of the top problem.
        """
        successRate: Float
    }

    """
    Represents a daily problem with the date it was available and whether it was solved.
    """
    type Daily {
        """
        The identifier or title of the daily problem.
        """
        problem: String
        
        """
        The date when the problem was available.
        """
        date: Date
        
        """
        Indicates whether the problem was solved.
        """
        solved: Boolean
    }
`;