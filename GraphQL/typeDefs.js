const { gql } = require('apollo-server');

const typeDefs = gql`

  type Query {
    getPosts: [Post]!
    getPost(id: ID!): Post
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(loginInput: LoginInput): User!
    createPost(postInput: PostInput): Post!
    deletePost(postID: ID!): Response!
    createComment(commentInput: CommentInput!): Post!
    deleteComment(deleteCommentInput: DeleteCommentInput!): Post!
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
    comments: [Comment]!
  }

  type Comment {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
  }

  type Like {
    username: String!
    createdAt: String!
  }

  type Response {
    message: String!
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

  input CommentInput {
    body: String!
    postID: ID!
  }

  input DeleteCommentInput {
    postID: ID!
    commentID: ID!
  }

`

module.exports = typeDefs;