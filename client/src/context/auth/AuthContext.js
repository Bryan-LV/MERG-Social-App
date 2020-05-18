import React, { useReducer, createContext } from 'react';

import AuthReducer from './AuthReducer';
import { LOGIN_USER, LOGOUT, REGISTER_USER, PERSIST_USER } from './AuthTypes';
import setToken from '../../utils/setToken';

export const AuthContext = createContext();

function AuthContextProvider(props) {
  const [authState, dispatch] = useReducer(AuthReducer, { user: null });

  const fire = {
    login: (userData) => {
      dispatch({ type: LOGIN_USER, payload: userData });
      setToken(userData);
    },
    register: (userData) => {
      dispatch({ type: REGISTER_USER, payload: userData });
      setToken(userData);
    },
    logout: () => {
      localStorage.removeItem('token');
      dispatch({ type: LOGOUT });
    },
    persistUser: () => {
      dispatch({ type: PERSIST_USER });
    }
  }

  return (
    <AuthContext.Provider value={{
      user: authState.user,
      fire: fire
    }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
