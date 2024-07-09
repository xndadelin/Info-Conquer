const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
app.use(bodyParser.json({ limit: '1024mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1024mb' }));
async function startServer() {
    const apolloServer = new ApolloServer({
        typeDefs: require('./graphql/typeDefs'),
        resolvers: require('./graphql/resolvers'),
        context: ({ req, res }) => ({ req, res }),
    });

    await apolloServer.start();

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        next();
    });
    
    app.use(cors({
        origin: ["https://studio.apollographql.com", "http://localhost:3000", "https://infoconquer.net"],
        credentials: true
    }));


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
