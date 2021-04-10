import faunadb from "faunadb"

export default client = new faunadb.Client({
  secret: process.env.FAUNA_SERVER_SECRET,
})
export default q = faunadb.query

// export default { client, q }
