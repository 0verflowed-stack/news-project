import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from '@apollo/client/link/context' 

const httpLink = createHttpLink({
    uri: "http://localhost:5000/"
});

const authLInk = setContext((_, { headers }) => {
    return {
        header: {
            ...headers,
            authorization: localStorage.getItem('token')
        }
    };
});

const client = new ApolloClient({
    link: authLInk.concat(httpLink),
    cache: new InMemoryCache()
});

export default client;