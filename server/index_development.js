const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
require('dotenv').config();

async function startServer() {
    const apolloServer = new ApolloServer({
        typeDefs: require('./graphql/typeDefs'),
        resolvers: require('./graphql/resolvers'),
        context: ({ req, res }) => ({ req, res }),
    });

    await apolloServer.start();

    app.use(cors({
        origin: ["https://studio.apollographql.com", "http://localhost:3000", "https://infoconquer.net"],
        credentials: true
    }));

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        next();
    });
    apolloServer.applyMiddleware({
        app,
        cors: false
    });

    app.listen(8080, () => {
        console.log('Server started in dev mode! Have fun!');
        mongoose.connect(process.env.MONGO_DB_CONN).then(() => {
            console.log('Database connected');
        });
    });
}

startServer();
