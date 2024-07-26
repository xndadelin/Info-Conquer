const { gql } = require('apollo-server-express');

module.exports = gql`
    """
    Represents a solution submitted by a user for a problem, including details about the code, problem, and test results.
    """
    type Solution {
        """
        The username of the user who submitted the solution.
        """
        username: String
        
        """
        The code submitted by the user for solving the problem.
        """
        code: String
        
        """
        The identifier or title of the problem that the solution is addressing.
        """
        problem: String
        
        """
        The programming language used in the solution.
        """
        language: String
        
        """
        The score achieved for the solution.
        """
        score: Int
        
        """
        A list of test cases that the solution was evaluated against.
        """
        tests: [TestCase]
        
        """
        The memory usage of the solution file, typically in bytes or megabytes.
        """
        fileMemory: String
        
        """
        The date and time when the solution was submitted.
        """
        date: String
        
        """
        Any compilation errors encountered while processing the solution.
        """
        compilationError: String
        
        """
        Indicates whether the solution was successful or not.
        """
        success: String
        
        """
        The unique identifier for the solution.
        """
        id_solution: String
        
        """
        The current status of the solution (e.g., pending, completed).
        """
        status: String
    }

    """
    Input type for submitting a new solution, including the code, problem identifier, and programming language.
    """
    input SolutionInput {
        """
        The code to be submitted for solving the problem.
        """
        code: String
        
        """
        The identifier or title of the problem the solution is for.
        """
        problem: String
        
        """
        The programming language used for the solution.
        """
        language: String
        
        """
        The type of the solution (optional, could specify different types of solutions).
        """
        type: String
    }

    """
    Represents a test case result for a submitted solution, including details about its execution and outcome.
    """
    type TestCase {
        """
        The status of the test case (e.g., passed, failed).
        """
        status: String
        
        """
        Indicates whether the test case was successful.
        """
        success: String
        
        """
        The amount of memory used by the test case, typically in bytes or megabytes.
        """
        memoryUsed: Float
        
        """
        The execution time of the test case, typically in seconds.
        """
        executionTime: Float
        
        """
        The score assigned to the test case.
        """
        score: Int
        
        """
        The input data provided to the test case.
        """
        input: String
        
        """
        The actual output produced by the solution for this test case.
        """
        output: String
        
        """
        The expected output for the test case.
        """
        expectedOutput: String
        
        """
        Any additional message or information related to the test case.
        """
        message: String
        
        """
        The exit code of the test case execution.
        """
        exitcode: Int
        
        """
        The signal number (if any) that caused the test case to terminate.
        """
        exitsig: Int
        
        """
        Standard error output from the test case execution.
        """
        cerr: String
    }

    """
    Represents a single submission of a solution for a problem, including details about the user, problem, and outcome.
    """
    type Submission {
        """
        The username of the user who made the submission.
        """
        username: String
        
        """
        The identifier or title of the problem that was solved.
        """
        problem: String
        
        """
        The programming language used for the submission.
        """
        language: String
        
        """
        The score achieved for the submission.
        """
        score: Int
        
        """
        The date and time when the submission was made.
        """
        date: String
        
        """
        Any compilation errors encountered with the submission.
        """
        compilationError: String
        
        """
        The unique identifier for the submission.
        """
        _id: String
        
        """
        The current status of the submission (e.g., pending, evaluated).
        """
        status: String
    }

    """
    Represents a collection of submissions, including all solutions and user-specific submissions.
    """
    type Submissions {
        """
        A list of all submissions related to the problem.
        """
        allSolutions: [Submission]
        
        """
        A list of submissions made by the current user.
        """
        userSolutions: [Submission]
    }
`;
