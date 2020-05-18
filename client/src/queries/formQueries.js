import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password:String!) {
    login(loginInput: {username: $username, password: $password}) {
      username
      id
      token
    }
  }
`

export const REGISTER_USER = gql`
  mutation RegisterUser ($username: String!, $email: String!, $password: String!, $confirmPassword: String! ){
    register(registerInput: {username:$username, email: $email, password: $password, confirmPassword: $confirmPassword}){
      id
      username
      token
    }
  }
`