import {ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
console.log(process.env.REACT_APP_SERVER)
const httpLink = createHttpLink({
    uri: process.env.REACT_APP_SERVER + '/graphql',
    credentials: 'include'
})
const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
})

export default client; 