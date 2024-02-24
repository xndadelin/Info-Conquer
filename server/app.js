const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { ApolloServer } = require('apollo-server-express') 
const cors = require('cors')
require('dotenv').config()
async function startServer(){
    const apolloServer = new ApolloServer({
        typeDefs: require('./graphql/typeDefs'),
        resolvers: require('./graphql/resolvers'),
        context: ({ req, res }) => ({ req, res }),
    
    })
    await apolloServer.start()
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "http://localhost:3001");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.header("Access-Control-Allow-Credentials", "true");
        next();
    });
  
    app.use(cors({
        origin: ["https://studio.apollographql.com", "http://localhost:3001"],
        credentials: 'include'
    }))
    app.get('/', (req, res) => {
        res.send('Hello World!')
    })
    app.post('/', (req, res) => {
        res.send('Hello world')
    })
    apolloServer.applyMiddleware({
        app,
        cors: false
    });    
    app.listen(3000, () => {
        mongoose.connect(process.env.MONGO_DB_CONN).then(() => {
            console.log('App connected and database connected')
        }).then(() => {
            console.log(`Server started`)
        })
    })
}
startServer()