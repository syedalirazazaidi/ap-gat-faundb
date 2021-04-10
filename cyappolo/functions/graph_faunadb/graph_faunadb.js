// graphql.js

const { ApolloServer, gql } = require("apollo-server-lambda")

require("dotenv").config()
const faunadb = require("faunadb")
const q = faunadb.query

const client = new faunadb.Client({ secret: process.env.FAUNA_SERVER_SECRET })

const typeDefs = gql`
  type Query {
    allCrud: [Crud!]
  }
  type Mutation {
    addTodo(text: String!): Crud
    deleteItem(id: ID!): Crud
  }

  type Crud {
    text: String!
    id: ID!
  }
`

const resolvers = {
  Query: {
    allCrud: async (root, args, context) => {
      try {
        const result = await client.query(
          q.Map(
            q.Paginate(q.Documents(q.Collection("my_crud"))),
            q.Lambda(x => q.Get(x))
          )
        )

        return result.data.map(item => {
          return { text: item.data.text, id: item.ts }
        })
      } catch (err) {
        console.log(err)
      }
    },
  },

  Mutation: {
    addTodo: async (_, { text }) => {
      try {
        const result = await client.query(
          q.Create(q.Collection("my_crud"), { data: { text } })
        )

        return result.ref.data
      } catch (err) {
        console.log(err, "ERROR")
      }
    },

    deleteItem: async (_, { id }) => {
      console.log(id, "IDENRasaR")
      try {
        const result = await client.query(
          q.Delete(q.Ref(q.Collection("my_crud"), "1617998989665000"))
        )

        // const result = await adminClient.query(
        //   q.Delete(q.Ref(q.Collection("Crud"), id))
        // )
        console.log(result, "LPLPLPLPLPLPLPl")
        // return {
        //   task: result.data.task,
        //   id: result.data.id,
        // }

        // console.log(result, "RESULTTTTLT")
      } catch (error) {
        console.log(error)
      }
    },
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

exports.handler = server.createHandler()
