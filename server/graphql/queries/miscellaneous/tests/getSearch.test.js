const { testServer } = require('../../../../jest.setup');
const mongoose = require('mongoose');
const User = require('../../../../models/user');
const Problem = require('../../../../models/problem');
const Article = require('../../../../models/article');
const Contest = require('../../../../models/contest');
const Announcement = require('../../../../models/announcements');

const GET_SEARCH = `
  query GetSearch($query: String!) {
    getSearch(query: $query) {
      users
      problems
      articles
      contests
      announcements
      totalResults
    }
  }
`;

const testData = {
    users: [
        { username: 'testuser1', email: 'test1@example.com', password: 'password', admin: false },
        { username: 'testuser2', email: 'test2@example.com', password: 'password', admin: false },
    ],
    problems: [
        { title: 'Test Problem 1', creator: 'testuser1', requirements: 'requirements', category: 'category', subcategories: [], timeExecution: 1, limitMemory: 128, tests: [{ input: 'input', output: 'output' }], languages: ['JavaScript'], difficulty: 'Easy', itsForContest: false },
        { title: 'Test Problem 2', creator: 'testuser2', requirements: 'requirements', category: 'category', subcategories: [], timeExecution: 1, limitMemory: 128, tests: [{ input: 'input', output: 'output' }], languages: ['JavaScript'], difficulty: 'Easy', itsForContest: false },
    ],
    articles: [
        { id: 'article1', title: 'Test Article 1', content: 'Content 1', creator: 'testuser1' },
        { id: 'article2', title: 'Test Article 2', content: 'Content 2', creator: 'testuser2' },
    ],
    contests: [
        { title: 'Test Contest 1', name: 'Contest 1', createdBy: 'testuser1', endDate: new Date(), startDate: new Date() },
        { title: 'Test Contest 2', name: 'Contest 2', createdBy: 'testuser2', endDate: new Date(), startDate: new Date() },
    ],
    announcements: [
        { title: 'Test Announcement 1', content: 'Content 1', createdBy: 'testuser1' },
        { title: 'Test Announcement 2', content: 'Content 2', createdBy: 'testuser2' },
    ],
};

beforeAll(async () => {
    await testServer.start();
    await mongoose.connect(process.env.TEST_MONGO_DB_CONN, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    await User.insertMany(testData.users);
    await Problem.insertMany(testData.problems);
    await Article.insertMany(testData.articles);
    await Contest.insertMany(testData.contests);
    await Announcement.insertMany(testData.announcements);
});

afterAll(async () => {
    await testServer.stop();
    await User.deleteMany({});
    await Problem.deleteMany({});
    await Article.deleteMany({});
    await Contest.deleteMany({});
    await Announcement.deleteMany({});
    await mongoose.disconnect();
});

it('should return search results', async () => {
    const query = 'Test';
    const response = await testServer.executeOperation({
        query: GET_SEARCH,
        variables: { query },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data.getSearch).toMatchObject({
        users: expect.any(Array),
        problems: expect.any(Array),
        articles: expect.any(Array),
        contests: expect.any(Array),
        announcements: null,
        totalResults: expect.any(Number),
    });
});
