const { testServer } = require('../../../../jest.setup');
const mongoose = require('mongoose');
const Article = require('../../../../models/article');

const GET_ARTICLES = `
query getArticles {
    getArticles {
        _id
        createdAt
        creator
        title
        excerpt
    }
}
`;

beforeAll(async () => {
    await testServer.start();
    await mongoose.connect(process.env.TEST_MONGO_DB_CONN, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const articlesData = [
        {
            title: 'Article 1',
            creator: 'user1',
            excerpt: 'Excerpt of article 1',
            content: 'Content of article 1',
        },
        {
            title: 'Article 2',
            creator: 'user2',
            excerpt: 'Excerpt of article 2',
            content: 'Content of article 2',
        }
    ];

    await Article.insertMany(articlesData);
});

afterAll(async () => {
    await testServer.stop();
    await Article.deleteMany({});
    await mongoose.disconnect();
});

it('should return an array of articles', async () => {

    const response = await testServer.executeOperation({
        query: GET_ARTICLES,
    });

    expect(response.errors).toBeUndefined();
    expect(response.data.getArticles).toBeInstanceOf(Array);
    expect(response.data.getArticles.length).toBeGreaterThan(0);
    expect(response.data.getArticles[0]._id).toBeDefined();
    expect(response.data.getArticles[0].createdAt).toBeDefined();
    expect(response.data.getArticles[0].creator).toBeDefined();
    expect(response.data.getArticles[0].title).toBeDefined();
    expect(response.data.getArticles[0].excerpt).toBeDefined();
});
