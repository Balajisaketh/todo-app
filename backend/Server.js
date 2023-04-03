const { query } = require('express');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');
const { graphql } = require('graphql');
const gql = require('graphql-tag');
const {postgraphile}=require('postgraphile');
const {ApolloServer}=require('apollo-server');
const { Pool } = require('pg');
// Define your GraphQL schema
const typeDefs = gql`
  type User {
    id:ID!
    name: String!
    email: String!
  }
  type Query {
    users: [User]!
    getusers:[User]!
    
  }
  type Mutation {
    createUser(name:String!,email:String!): User!,
    updateUser(id:ID!,name:String!,email:String!): User!,
    deleteUser(id:ID!):String!
  }
`;
const app = express();
const pool = new Pool({
  user: 'postgres',
  host:'127.0.0.1',
  database: 'graph',
  password: '12345',
  port: 5432,
}); 
// Define your resolvers
const resolvers = {
  Query: {
    async getusers() {
      try {
        const dogs = await pool.query('SELECT * FROM users')
        return dogs.rows;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async createUser(_,{name,email})
    {
      try{
        const query={
          text:'INSERT INTO users (id,name,email) VALUES(uuid_generate_v4(),$1,$2) RETURNING *',
          values:[name,email]
        }
        const database = await pool.query(query);
        console.log(database,"i m dara")
        return database.rows[0]
      }
      catch (error){
        throw new Error(error,"i m msg")
      }

    },
    async updateUser(_,{id,name,email})
    {
      try{
        const query={
          text: 'UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *',
          values: [name,email, id]
        }
        const database = await pool.query(query);
       return database.rows[0]
      }
      catch (error){
        throw new Error(error,"i m msg")
      }

    },
    async deleteUser(_,{id})
    {
      try{
        const query={
          text:'DELETE FROM users WHERE id=$1',
          values:[id]
        }
        const database = await pool.query(query);
        console.log(database,"i m delketed users")
        return "deleted users"
      }
      catch (error){
        throw new Error(error,"i m msg")
      }

    }
    
    
}
} 
const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
app.use
(
  '/graphql',
  postgraphile(
    "postgres://postgres:balaji31@127.0.0.1:5432/graph",
      'public',
      {
        watchPg: true,
        graphiql: true,
        enhanceGraphiql: true,
        
        
      }
    ))
// Create an executable schema
// Set up an Express server
server.listen(4000, () => {
  console.log('GraphQL server running at http://localhost:4000/graphql');
});
