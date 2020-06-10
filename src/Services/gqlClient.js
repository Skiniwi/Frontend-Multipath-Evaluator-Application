import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";

import { HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";

import Config from "../Config/Config";

const authLink = setContext((_, { headers }) => {
    const token = Config.gqlToken;
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    };
});

const httpLink = new HttpLink({
    uri: Config.gqlBaseURL
});

const GqlClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

export default GqlClient;
