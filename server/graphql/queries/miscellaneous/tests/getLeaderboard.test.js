const { testServer } = require('../../../../jest.setup');
const mongoose = require('mongoose');
const User = require('../../../../models/user');

const GET_LEADERBOARD = `
  query GetLeaderboard {
    getLeaderboard {
      username
      solvedProblems
      profilePicture
    }
  }
`;

const testUsers = [
  {
    username: 'user1',
    email: 'user1@test.com',
    verified: true,
    admin: false,
    solvedProblems: ['problem1', 'problem2', 'problem3'],
    profilePicture: 'user1.jpg'
  },
  {
    username: 'user2',
    email: 'user2@test.com',
    verified: true,
    admin: false,
    solvedProblems: ['problem1', 'problem2'],
    profilePicture: 'user2.jpg'
  },
  {
    username: 'user3',
    email: 'user3@test.com',
    verified: false,
    admin: false,
    solvedProblems: ['problem1', 'problem2', 'problem3', 'problem4'],
    profilePicture: 'user3.jpg'
  }
];

beforeAll(async () => {
  await testServer.start();
  await mongoose.connect(process.env.TEST_MONGO_DB_CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await User.insertMany(testUsers);
});

afterAll(async () => {
  await testServer.stop();
  await User.deleteMany({});
  await mongoose.disconnect();
});

describe('Leaderboard Query', () => {
  it('should return the leaderboard with verified users sorted by solved problems', async () => {
    const response = await testServer.executeOperation({
      query: GET_LEADERBOARD,
    });

    expect(response.errors).toBeUndefined();
    expect(response.data.getLeaderboard).toBeDefined();

    const leaderboard = response.data.getLeaderboard;
    expect(leaderboard[0]).toEqual({
      username: 'user1',
      solvedProblems: 3,
      profilePicture: 'user1.jpg'
    });
    expect(leaderboard[1]).toEqual({
      username: 'user2',
      solvedProblems: 2,
      profilePicture: 'user2.jpg'
    });

    expect(leaderboard[0].solvedProblems).toBeGreaterThanOrEqual(leaderboard[1].solvedProblems);
  });

  it('should not include unverified users in the leaderboard', async () => {
    const response = await testServer.executeOperation({
      query: GET_LEADERBOARD,
    });

    expect(response.errors).toBeUndefined();
    expect(response.data.getLeaderboard).toBeDefined();

    const leaderboard = response.data.getLeaderboard;
    const unverifiedUser = leaderboard.find(user => user.username === 'user3');
    expect(unverifiedUser).toBeUndefined();
  });
});