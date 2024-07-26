const { testServer } = require('../../../../jest.setup');
const mongoose = require('mongoose');
const Problem = require('../../../../models/problem');
const User = require('../../../../models/user');


const GET_HOMEPAGE_INFO = `
    query getHomepageInfo {
        getHomepageInfo {
            topProblems {
                title
                difficulty
                successRate
                tags
            }
            lastSeven {
                date
                count
            }
        }
    }
`;

const problemData = [
    {
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
    },
    {
        title: 'Problem 2',
        difficulty: 'Medium',
        successRate: 0.8,
        tags: ['String'],
        acceptedSolutions: 8,
        itsForContest: true,
        limitMemory: 1024,
        timeExecution: 3000,
        category: 'Data Structures',
        requirements: 'mock requirements',
        creator: 'admin',
        tests: ['Test case 1'],
        languages: ['JavaScript'],
    },
    {
        title: 'Problem 3',
        difficulty: 'Hard',
        successRate: 0.7,
        tags: ['Tree'],
        acceptedSolutions: 6,
        itsForContest: true,
        limitMemory: 2048,
        timeExecution: 5000,
        category: 'Trees',
        requirements: 'mock requirements',
        creator: 'admin',
        tests: ['Test case 1', 'Test case 2', 'Test case 3'],
        languages: ['Python'],
    },
    {
        title: 'Problem 4',
        difficulty: 'Medium',
        successRate: 0.85,
        tags: ['Graph'],
        acceptedSolutions: 9,
        itsForContest: false,
        limitMemory: 1024,
        timeExecution: 2500,
        category: 'Graphs',
        requirements: 'mock requirements',
        creator: 'admin',
        tests: ['Test case 1'],
        languages: ['JavaScript', 'C++'],
    },
    {
        title: 'Problem 5',
        difficulty: 'Easy',
        successRate: 0.95,
        tags: ['LinkedList'],
        acceptedSolutions: 12,
        itsForContest: false,
        limitMemory: 256,
        timeExecution: 1500,
        category: 'Linked Lists',
        requirements: 'mock requirements',
        creator: 'admin',
        tests: ['Test case 1', 'Test case 2'],
        languages: ['Python'],
    },
];


const userData = {
    username: 'xndadelin',
    solutions: [
        { date: new Date() },
        { date: new Date(new Date().setDate(new Date().getDate() - 1)) },
        { date: new Date(new Date().setDate(new Date().getDate() - 2)) },
    ],
    admin: true,
    verified: true,
};

beforeAll(async () => {
    await testServer.start();
    await mongoose.connect(process.env.TEST_MONGO_DB_CONN, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    await Problem.insertMany(problemData);
    const newUser = new User(userData);
    await newUser.save();
});

afterAll(async () => {
    await testServer.stop();
    await Problem.deleteMany({});
    await User.deleteMany({});
    await mongoose.disconnect();
});

it('should return homepage info', async () => {
    const response = await testServer.executeOperation({
        query: GET_HOMEPAGE_INFO,
    });

    expect(response.errors).toBeUndefined();
    
    const topProblems = response.data.getHomepageInfo.topProblems.sort((a, b) => a.title.localeCompare(b.title));
    expect(topProblems.length).toBe(5);
    topProblems.forEach((problem, index) => {
        expect(problem.title).toEqual(problemData[index].title);
        expect(problem.difficulty).toEqual(problemData[index].difficulty);
        expect(problem.successRate).toEqual(problemData[index].successRate);
        expect(problem.tags).toEqual(expect.arrayContaining(problemData[index].tags));
    });

    const lastSeven = response.data.getHomepageInfo.lastSeven;
    expect(lastSeven.length).toBe(7);
    lastSeven.forEach((entry, index) => {
        const date = new Date();
        date.setDate(date.getDate() - index);
        expect(new Date(+entry.date).toDateString()).toEqual(date.toDateString());
/*         const expectedCount = userData.solutions.filter(solution => {
            const solutionDate = new Date(+solution.date);
            return solutionDate < date;
        }).length;
        expect(entry.count).toEqual(expectedCount); */
    });
});
