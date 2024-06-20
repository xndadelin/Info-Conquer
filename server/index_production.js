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
	app.set('trust proxy', true);
	app.use(cors({
        	origin: ["https://studio.apollographql.com", "http://localhost:3000", "https://infoconquer.net"],
    	credentials: 'include'
	}))
	apolloServer.applyMiddleware({
    	app,
    	cors: true
	});
	app.listen(8080, () => {
    	console.log('Server started in dev mode! Have fun!')
    	mongoose.connect(process.env.MONGO_DB_CONN).then(() => {
      	console.log('Database connected')
    	})
	})
}
startServer()