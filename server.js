const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');
require('dotenv').config();

const typeDefs = require('./GraphQL/typeDefs')
const resolvers = require('./GraphQL/resolvers');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req })
});

setupServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const startServer = await server.listen({ port: 4000 });
    console.log(`Server running on port ${startServer.url}`);
    console.log('database connected');

  } catch (error) {
    console.log(error);
  }
}

setupServer()

