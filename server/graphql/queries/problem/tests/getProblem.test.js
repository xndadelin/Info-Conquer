const { testServer } = require('../../../../jest.setup');
const mongoose = require('mongoose');
const Problem = require('../../../../models/problem');

const GET_PROBLEM = `
query GetProblem($title: String!, $contest: String, $daily: Date) {
    getProblem(title: $title, contest: $contest, daily: $daily) {
        title
        creator
        description
        requirements
        tags
        category
        difficulty
        subcategories
        input
        output
        timeExecution
        limitMemory
        examples {
            input
            explanation
            output
        }
        indications
        languages
        restriction
        successRate
        userHasRated
        rating
        contest
    }
}
`

const problemData = {
    title: 'Problem 1',
    difficulty: 'Easy',
    successRate: 0.9,
    tags: ['Array'],
    acceptedSolutions: 10,
    itsForContest: false,
    limitMemory: 512,
    timeExecution: 2000,
    category: 'Algorithm',
    requirements: 'mock requirements',
    creator: 'admin',
    tests: ['Test case 1', 'Test case 2'],
    languages: ['JavaScript', 'Python'],
}

beforeAll(async () => {
    await testServer.start();
    await mongoose.connect(process.env.TEST_MONGO_DB_CONN, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    await Problem.deleteMany({});
    await Problem.create(problemData);
})
afterAll(async () => {
    await testServer.stop();
    await Problem.deleteMany({});
    await mongoose.disconnect();
})
it('should return a problem', async () => {
    const response = await testServer.executeOperation({
        query: GET_PROBLEM,
        variables: { title: 'Problem 1' },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data.getProblem).toMatchObject({
        title: 'Problem 1',
        creator: 'admin',
        description: null,
        requirements: 'mock requirements',
        category: 'Algorithm',
        difficulty: 'Easy',
        subcategories: [],
        input: null,
        output: null,
        timeExecution: 2000,
        limitMemory: 512,
        examples: [],
        indications: null,
        restriction: null,
        successRate: 100,
        rating: 0,
        contest: null
    });
})