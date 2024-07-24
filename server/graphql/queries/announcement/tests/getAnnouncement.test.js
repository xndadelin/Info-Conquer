const { testServer } = require('../../../../jest.setup');
const mongoose = require('mongoose');
const Announcement = require('../../../../models/announcements');

const GET_ANNOUNCEMENT = `
query getAnnouncement($title: String) {
    getAnnouncement(title: $title) {
        title
        content
        createdBy
    }
}
`;

const data = {
    title: "ANNOUNCEMENT TEST",
    createdBy: 'xndadelin',
    content: `<article>
<h1>Announcement</h1>
<p>We are excited to announce that our company is expanding! We have been working hard behind the scenes to bring you a broader range of products and services.</p>
<p>We wish to extend our heartfelt thanks to every one of you for your vital support and commitment. We look forward to sharing this exciting journey with you.</p>
</article>`
};

beforeAll(async () => {
    await testServer.start();
    await mongoose.connect(process.env.TEST_MONGO_DB_CONN, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await Announcement.deleteOne({ title: data.title });
    
    await testServer.stop();
    await mongoose.disconnect();
});

it('should return an announcement', async () => {
    const newAnnouncement = new Announcement({
        title: data.title,
        createdBy: data.createdBy,
        content: data.content,
    });
    
    await newAnnouncement.save();

    const response = await testServer.executeOperation({
        query: GET_ANNOUNCEMENT,
        variables: { title: 'ANNOUNCEMENT TEST' },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data.getAnnouncement.title).toEqual(data.title);
    expect(response.data.getAnnouncement.createdBy).toEqual(data.createdBy);
    expect(response.data.getAnnouncement.content).toEqual(data.content)
});
