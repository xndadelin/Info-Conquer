const { testServer } = require('../../../../jest.setup');
const mongoose = require('mongoose');
const Daily = require('../../../../models/daily');

const GET_DAILIES = `
  query GetDailies {
    getDailies {
      problem
      date
      solved
    }
  }
`;

const testData = [
  {
    problem: 'Test Problem 1',
    date: new Date('2023-07-27'),
    solvers: ['someuser'],
    ended: false,
  },
  {
    problem: 'Test Problem 2',
    date: new Date('2023-07-28'),
    solvers: [],
    ended: false,
  },
];

beforeAll(async () => {
  await testServer.start();
  await mongoose.connect(process.env.TEST_MONGO_DB_CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await Daily.deleteMany({});
  await Daily.insertMany(testData);
});

afterAll(async () => {
  await testServer.stop();
  await Daily.deleteMany({});
  await mongoose.disconnect();
});

it('should return dailies', async () => {
  const response = await testServer.executeOperation({
    query: GET_DAILIES,
  });

    expect(response.errors).toBeUndefined();
    expect(response.data.getDailies).toBeInstanceOf(Array);
});