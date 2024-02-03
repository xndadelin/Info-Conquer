import {ApolloClient, InMemoryCache, HttpLink, createHttpLink } from '@apollo/client'

const httpLink = createHttpLink({
    uri: 'http://localhost:3000/graphql',
    credentials: 'include'
})
const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
})

export default client; 