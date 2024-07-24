import {ApolloClient, InMemoryCache, createHttpLink} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import Cookies from 'js-cookie'

const httpLink = createHttpLink({
    uri: process.env.REACT_APP_SERVER,
    credentials: 'include'
})

const authLink = setContext((_, {headers}) => {
    const token = Cookies.get('csrfToken')
    return {
        headers: {
            ...headers,
            'x-csrf-token': token
        }
    }
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})

export default client; 