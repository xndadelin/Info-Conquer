const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { ApolloServer } = require('apollo-server-express') 
const cors = require('cors')
const crypto = require('crypto')
require('dotenv').config()
async function startServer(){
    const apolloServer = new ApolloServer({
        typeDefs: require('./graphql/typeDefs'),
        resolvers: require('./graphql/resolvers'),
        context: ({ req, res }) => ({ req, res }),
    
    })
    await apolloServer.start()
    app.use((req, res, next) => {
      const allowedOrigin = process.env.MODE === 'dev' ? 'http://localhost:3000' : "https://www.infoconquer.net";
      res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      req.crsfToken = crypto.randomBytes(64).toString('hex');
      next();
    });
    app.set('trust proxy', true);
    app.use(cors({
        origin: ["https://www.infoconquer.net", "http://localhost:3000", "https://studio.apollographql.com"],
        credentials: 'include'
    }))
    apolloServer.applyMiddleware({
        app,
        cors: false
    });    
    app.listen(8080, () => {
        console.log('Server started in dev mode! Have fun!')
        mongoose.connect(process.env.MONGO_DB_CONN).then(() => {
          console.log('Database connected')
        })
    })
}
startServer()
