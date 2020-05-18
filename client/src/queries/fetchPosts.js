import { gql } from '@apollo/client';

export const fetchPosts = gql`
{
  getPosts{
    id
    body
    username
    createdAt
    comments{
      createdAt
      body
      id
      username
    }
    likes{
      id
      username
      createdAt
    }
  }
}
`
