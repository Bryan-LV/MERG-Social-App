import React, { useState, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import { AuthContext } from '../../context/auth/AuthContext';
import { LOGIN_USER } from '../../queries/formQueries';
import '../../styles/forms.css';

function Login() {
  const [value, setValue] = useState({ username: '', password: '' });
  const { fire } = useContext(AuthContext);
  const [errorsMessage, setErrorMessage] = useState(null);

  const history = useHistory();

  const [sendLogin] = useMutation(LOGIN_USER, {
    onCompleted({ login }) {
      // at successful login, add user to global state
      fire.login(login)
      // push to home page
      history.push('/');
    },
    onError(error) {
      // display error message to user
      setErrorMessage(error.message);
    }
  });

  const validateInputs = () => {
    // check if username && password are not empty
    if (value.username === '') {
      setErrorMessage('Username cannot be empty');
      return false;
    }
    if (value.password === '') {
      setErrorMessage('Password cannot be empty');
      return false;
    }
    if (value.username !== '' && value.password !== '') return true
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // validate form inputs
    const isValid = validateInputs()
    if (isValid) {
      // send mutation
      sendLogin({ variables: value });
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label htmlFor="username">Username</label>
      <input className="form-inputs" type="text" name="username" placeholder="username" value={value.username} onChange={e => setValue({ ...value, [e.target.name]: e.target.value })} />
      <label htmlFor="password">Password</label>
      <input className="form-inputs" type="password" name="password" placeholder="password" value={value.password} onChange={e => setValue({ ...value, [e.target.name]: e.target.value })} />
      <button className="button" type="submit">Login</button>
      <div className="errors">
        {errorsMessage && <h4>{errorsMessage}</h4>}
      </div>
    </form>
  )
}

export default Login
