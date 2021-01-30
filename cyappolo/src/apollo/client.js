import { ApolloClient, InMemoryCache } from "@apollo/client"

export const client = new ApolloClient({
  uri: "https://localhost:8888/.netlify/functions/graph_faunadb",
  cache: new InMemoryCache(),
})
