import JwtDecode from "jwt-decode";
import { gql } from '@apollo/client';
import { client } from '../index';

export default async function checkToken() {
  // check if token is set in local storage
  let token = JSON.parse(localStorage.getItem('token'));
  // no token - return false
  if (!token) return false;
  // token ? check if expired
  let decodedToken = JwtDecode(token);
  if (Date.now() >= decodedToken.exp * 1000) {
    localStorage.clear();
    return false;
  }

  try {
    // verify token is valid
    const isVerified = await client.query({
      query: gql`{
      checkAuth(token: ${localStorage.getItem('token')}){
        message
        isValid
      }
    }`
    })
    const response = isVerified.data.checkAuth;
    const authResponse = response.isValid ? true : false;
    return authResponse;
  } catch (error) {
    console.log('error:', error);
    return false
  }
}