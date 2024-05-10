const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { ApolloServer } = require('apollo-server-express') 
const cors = require('cors')
const crypto = require('crypto')
const https = require('https')
const fs = require('fs')
const path = require('path')
require('dotenv').config()
async function startServer(){
    const apolloServer = new ApolloServer({
        typeDefs: require('./graphql/typeDefs'),
        resolvers: require('./graphql/resolvers'),
        context: ({ req, res }) => ({ req, res }),
    
    })
    await apolloServer.start()
    app.use((req, res, next) => {
      const allowedOrigins = [
        "http://localhost:3001",
        "https://159.89.12.247:3001",
      ];
      const origin = req.headers.origin;
      if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
      }
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      req.crsfToken = crypto.randomBytes(64).toString('hex');
      next();
    });

    app.set('trust proxy', true);
    app.use(cors({
        origin: ["https://studio.apollographql.com", "http://localhost:3001", "https://159.89.12.247:3001"],
        credentials: 'include'
    }))
    app.get('/', (req, res) => {
        res.send('Hello this is infoconquer server!!!')
    })
    apolloServer.applyMiddleware({
        app,
        cors: false
    });    
    const httpsServer = https.createServer({
	      key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
	      cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
    }, app)
    
    httpsServer.listen(3000, () => {
	      console.log('HTTPS initialized')
        mongoose.connect(process.env.MONGO_DB_CONN).then(() => {
          console.log('Database connected')
          console.log('Server started! Have fun!')
        })
    })
}
startServer()
