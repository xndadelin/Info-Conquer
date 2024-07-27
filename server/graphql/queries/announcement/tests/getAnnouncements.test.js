const { testServer } = require('../../../../jest.setup');
const mongoose = require('mongoose');
const Announcement = require('../../../../models/announcements');

const GET_ANNOUNCEMENTS = `
query getAnnouncements {
    getAnnouncements {
        title
        content
        createdBy
    }
}`;

beforeAll(async () => {
    await testServer.start();
    await mongoose.connect(process.env.TEST_MONGO_DB_CONN, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    await Announcement.deleteMany({});

    const announcementsData = [
        {
            title: 'Announcement 1',
            createdBy: 'user1',
            content: 'Content of announcement 1'
        },
        {
            title: 'Announcement 2',
            createdBy: 'user2',
            content: 'Content of announcement 2'
        }
    ];

    await Announcement.insertMany(announcementsData);
});

afterAll(async () => {
    await testServer.stop();
    await Announcement.deleteMany({});
    await mongoose.disconnect();
});

it('should return an array of announcements', async () => {
    const response = await testServer.executeOperation({
        query: GET_ANNOUNCEMENTS,
    });

    expect(response.errors).toBeUndefined();
    expect(response.data.getAnnouncements).toBeInstanceOf(Array);
    expect(response.data.getAnnouncements.length).toBeGreaterThan(0);
    
    expect(response.data.getAnnouncements[0].title).toBeDefined();
    expect(response.data.getAnnouncements[0].content).toBeDefined();
    expect(response.data.getAnnouncements[0].createdBy).toBeDefined();
});

