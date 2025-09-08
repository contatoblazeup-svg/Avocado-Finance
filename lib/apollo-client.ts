import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"

const httpLink = createHttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
})

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
  },
})
