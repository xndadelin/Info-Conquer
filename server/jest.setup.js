const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
require('dotenv').config();
const token = process.env.SECRET_TOKEN;
const refreshToken = process.env.SECRET_REFRESH_TOKEN;

const testServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        req = {};
        req.headers = {};
        req.headers.cookie = `token=${token}; refreshToken=${refreshToken}`;
        return { req };
    },
})

module.exports = {
    testServer
} 