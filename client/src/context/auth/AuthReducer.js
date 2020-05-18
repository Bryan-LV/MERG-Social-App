import JwtDecode from "jwt-decode";

import { LOGIN_USER, LOGOUT, REGISTER_USER, PERSIST_USER } from './AuthTypes'

const getUserFromToken = () => {
  let token = JSON.parse(localStorage.getItem('token'));
  const decodedToken = JwtDecode(token);
  return {
    username: decodedToken.username,
    id: decodedToken.id,
    email: decodedToken.email
  }
}

export default function AuthReducer(state, action) {
  switch (action.type) {
    case LOGIN_USER:
    case REGISTER_USER:
      return { user: action.payload };
      break;
    case PERSIST_USER:
      let payload = getUserFromToken();
      return { user: payload };
      break;
    case LOGOUT:
      return { user: null };
      break;
    default:
      return state
      break;
  }
}