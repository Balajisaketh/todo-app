const { query } = require('express');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');
const { Pool } = require('pg');
const { graphql } = require('graphql');
const {postgraphile}=require('postgraphile')
const typeDefs = `
type Query
{
    hello:String
}
`;
const app = express();
const pool = new Pool({
    user: 'postgres',
    host:'127.0.0.1',
    database: 'graph',
    password: 'balaji31',
    port: 5432,
  }); 
  const resolvers = {
    Query: {
      hello: () => "Hello World!"
    },
}

app.use
(
  postgraphile(
    "postgres://postgres:balaji31@127.0.0.1:5432/graph",
      'public',
      {
        watchPg: true,
        graphiql: true,
        enhanceGraphiql: true,
        
      }
    ))

app.listen(4000, () => {
  console.log('GraphQL server running at http://localhost:4000/graphql');
});