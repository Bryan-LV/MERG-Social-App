import React, { useEffect, useContext } from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './components/containers/Home';
import Login from './components/containers/Login';
import Nav from './components/presentational/Nav';
import Register from './components/containers/Register';
import { AuthContext } from './context/auth/AuthContext';
import checkToken from './utils/checkToken';

import './styles/App.css';
function App() {
  const { user, fire } = useContext(AuthContext);
  useEffect(() => {
    // if user is null
    if (user === null) {
      // check if token is valid
      checkToken()
        .then(res => {
          // if token is not valid logout user
          if (!res) {
            fire.logout();
          } else {
            // persist user
            fire.persistUser()
          }
        })
        .catch(err => console.log(err));
    }

  }, [])

  return (
    <div className="App">
      <Nav />
      <Switch>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
