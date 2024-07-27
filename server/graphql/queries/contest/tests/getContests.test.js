const { testServer } = require('../../../../jest.setup');
const mongoose = require('mongoose');
const Contest = require('../../../../models/contest');
const ObjectId = mongoose.Types.ObjectId;

const ids = ["668537eca619549fa25c3220", "6685353b2dcdb5d125e25b4d", "6676e36a79c123cf34156e57"];

const contests = [
    {
        _id: new ObjectId(ids[0]),
        description: "Test11",
        endDate: new Date("2024-07-02T07:00:00.000Z"),
        languages: ["JavaScript", "Python", "Java", "C#", "C++", "TypeScript", "Rust", "PHP", "C"],
        name: "Test1",
        startDate: new Date("2024-07-01T21:00:00.000Z"),
        createdBy: "xndadelin",
        ended: true,
        started: true,
    },
    {
        _id: new ObjectId(ids[1]),
        description: "Test22",
        endDate: new Date("2024-08-02T07:00:00.000Z"),
        languages: ["JavaScript", "Python"],
        name: "Test2",
        startDate: new Date("2024-08-01T21:00:00.000Z"),
        createdBy: "user2",
        ended: false,
        started: false,
    }
];

const GET_CONTESTS = `
  query GetContests {
    getContests {
      _id
      description
      endDate
      languages
      name
      startDate
      createdBy
      ended
      started
      hasJoined
    }
  }
`;

beforeAll(async () => {
    await testServer.start();
    await mongoose.connect(process.env.TEST_MONGO_DB_CONN, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    await Contest.deleteMany({});
    await Contest.insertMany(contests);
});

afterAll(async () => {
    await testServer.stop();
    await Contest.deleteMany({});
    await mongoose.disconnect();
});

it('should return all contests', async () => {

    const response = await testServer.executeOperation({
        query: GET_CONTESTS,
    });

    expect(response.errors).toBeUndefined();

    response.data.getContests.forEach((contest, index) => {
        if(contests[index]){
            expect(contest).toMatchObject({
                _id: ids[index],
                description: contests[index].description,
                endDate: contests[index].endDate,
                languages: contests[index].languages,
                name: contests[index].name,
                startDate: contests[index].startDate,
                createdBy: contests[index].createdBy,
                ended: contests[index].ended,
                started: contests[index].started,
            });
        }
    });
});