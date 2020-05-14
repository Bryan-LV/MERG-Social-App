const { gql } = require('apollo-server');

const typeDefs = gql`

  type Query {
    getPosts: [Post!]!
    getPost(id: ID!): Post
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(loginInput: LoginInput): User!
    createPost(postInput: PostInput): Post!
  }

  type User {
    id: ID!
    email: String!
    username: String!
    createdAt: String!
    token: String!
  }

  type Post {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
  }

  input RegisterInput { 
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  input LoginInput {
    username: String!
    password: String!
  }

  input PostInput {
    body: String!
  }


`

module.exports = typeDefs;