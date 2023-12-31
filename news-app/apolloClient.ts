import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { getData } from "./src/storage";

const LOCAL_IP = '192.168.50.167';

const httpLink = createHttpLink({
    uri: `http://${LOCAL_IP}:5000/`
});

const authLink = setContext(async (_, { headers }) => {
    return {
        headers: {
            ...headers,
            authorization: `Bearer ${await getData('token')}`
        }
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

export default client;