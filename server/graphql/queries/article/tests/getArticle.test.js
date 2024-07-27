const { testServer } = require('../../../../jest.setup');
const mongoose = require('mongoose');
const Article = require('../../../../models/article');

const GET_ARTICLE = `
    query GetArticle($id: String) {
        getArticle(id: $id) {
            content
            createdAt
            creator
            hasDisliked
            dislikes
            hasLiked
            likes
            title
            tags
            updatedAt
            excerpt
        }
    }
`;

const data = {
    title: 'sdasdasd',
    content: '<p>asdasd</p>',
    creator: 'xndadelin',
    excerpt: 'asdsdasd',
    _id: '6693e2282de4816a589caa7d',
    likes: [],
    dislikes: [],
};

beforeAll(async () => {
    await testServer.start();
    await mongoose.connect(process.env.TEST_MONGO_DB_CONN, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    await Article.deleteMany({});
    await Article.create(data);
});

afterAll(async () => {
    await testServer.stop();
    await Article.deleteMany({});
    await mongoose.disconnect();
});

it('should return an article', async () => {
    const response = await testServer.executeOperation({
        query: GET_ARTICLE,
        variables: { id: data._id },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data.getArticle.title).toEqual(data.title);
    expect(response.data.getArticle.content).toEqual(data.content);
    expect(response.data.getArticle.creator).toEqual(data.creator);
    expect(response.data.getArticle.excerpt).toEqual(data.excerpt);
});
