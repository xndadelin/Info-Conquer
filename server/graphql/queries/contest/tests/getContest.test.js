const { testServer } = require('../../../../jest.setup');
const mongoose = require('mongoose');
const Contest = require('../../../../models/contest');
const ObjectId = mongoose.Types.ObjectId;

const ids = ["661537eca612549fa25c3220", "6685353b2dcc51b5df2e25b4d", "6671e36a79c87cf34c56e576"];

const contests = [
    {
        _id: new ObjectId(ids[0]),
        description: "Test1",
        endDate: new Date("2024-07-02T07:00:00.000Z"),
        languages: ["JavaScript", "Python", "Java", "C#", "C++", "TypeScript", "Rust", "PHP", "C"],
        name: "Test1",
        startDate: new Date("2024-07-01T21:00:00.000Z"),
        createdBy: "xndadelin",
        ended: true,
        started: true,
    }
];


const GET_CONTEST = `
query GetContest($id: String) {
    getContest(id: $id) {
        description
        endDate
        languages
        name
        startDate
        createdBy
        problems {
            id
            category
            difficulty
            subcategories
        }
        participants {
            username
            score
            problems {
                id
                score
            }
        }
        started 
        ended
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
    const newContest = new Contest({
        ...contests[0],
        _id: new ObjectId(ids[0]),
    });
    await newContest.save();
});

afterAll(async () => {
    await testServer.stop();
    await mongoose.disconnect();
});

it('should return a contest', async () => {
    const response = await testServer.executeOperation({
        query: GET_CONTEST,
        variables: { id: ids[0] },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data.getContest).toMatchObject({
        description: contests[0].description,
        endDate: contests[0].endDate,
        languages: contests[0].languages,
        name: contests[0].name,
        startDate: contests[0].startDate,
        createdBy: contests[0].createdBy,
        started: contests[0].started,
        ended: contests[0].ended,
    });

    await Contest.deleteMany({});
});
