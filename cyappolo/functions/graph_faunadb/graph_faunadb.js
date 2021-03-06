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
    ToggleTodo(id: ID!): Crud
  }

  type Crud {
    text: String!
    id: ID!
    isCompleted: Boolean
  }
`

const resolvers = {
  Query: {
    allCrud: async (root, args, context) => {
      try {
        const result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index("cruding"))),
            q.Lambda("x", q.Get(q.Var("x")))
          )
        )

        return result.data.map(item => {
          return {
            isCompleted: item.data.isCompleted,
            text: item.data.text,
            id: item.ref.id,
          }
        })
      } catch (err) {
        console.log(err)
      }
    },
  },

  Mutation: {
    ToggleTodo: async (_, { id }) => {
      const results = await client.query(
        q.Update(q.Ref(q.Collection("my_crud"), id), {
          data: {
            isCompleted: true,
          },
        })
      )
      return {
        ...results.data,
        id: results.ref.id,
      }
    },
    addTodo: async (_, { text }) => {
      try {
        const result = await client.query(
          q.Create(q.Collection("my_crud"), {
            data: { text, isCompleted: false },
          })
        )

        return result.ref.data
      } catch (err) {
        console.log(err, "ERROR")
      }
    },

    deleteItem: async (_, { id }) => {
      try {
        const result = await client.query(
          q.Delete(q.Ref(q.Collection("my_crud"), id))
        )
      } catch (error) {
        console.log(error)
      }
    },
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

exports.handler = server.createHandler()
