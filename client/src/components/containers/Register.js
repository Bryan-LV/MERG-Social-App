import React, { useState, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import { AuthContext } from '../../context/auth/AuthContext';
import { REGISTER_USER } from '../../queries/formQueries';
import '../../styles/forms.css'

function Register(props) {
  const [value, setValue] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { fire } = useContext(AuthContext);
  const [errorsMessage, setErrorMessage] = useState(null);

  const history = useHistory();

  const [sendRegistration] = useMutation(REGISTER_USER, {
    onCompleted({ register }) {
      // at successful registration, add user to global state
      fire.register(register)
      // push to home page
      history.push('/');
    },
    onError(error) {
      // display error message to user
      setErrorMessage(error.message);
    }
  });

  const validateInputs = () => {
    if (value.username === '') {
      setErrorMessage('Username cannot be empty');
      return false;
    }
    if (value.email === '') {
      setErrorMessage('Email cannot be empty');
      return false;
    }
    if (value.password === '') {
      setErrorMessage('Password cannot be empty');
      return false;
    }
    if (value.confirmPassword === '') {
      setErrorMessage('Please retype password');
      return false;
    }
    if (value.password !== value.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return false;
    }
    // if inputs are not empty
    if (value.username !== '' && value.password !== '' && value.email !== '' && value.confirmPassword !== '') {
      return true
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // validate inputs
    const isValid = validateInputs();
    if (isValid) {
      // send mutation
      sendRegistration({ variables: value });
    }
  }


  return (
    <form className="form" onSubmit={handleSubmit}>
      <label htmlFor="username">Username</label>
      <input className="form-inputs" type="text" name="username" placeholder="username" value={value.username} onChange={e => setValue({ ...value, [e.target.name]: e.target.value })} />
      <label htmlFor="email">Email</label>
      <input className="form-inputs" type="email" name="email" placeholder="email" value={value.email} onChange={e => setValue({ ...value, [e.target.name]: e.target.value })} />
      <label htmlFor="password">Password</label>
      <input className="form-inputs" type="password" name="password" placeholder="password" value={value.password} onChange={e => setValue({ ...value, [e.target.name]: e.target.value })} />
      <label htmlFor="confirmPassword">Confirm Password</label>
      <input className="form-inputs" type="password" name="confirmPassword" placeholder="confirm password" value={value.confirmPassword} onChange={e => setValue({ ...value, [e.target.name]: e.target.value })} />
      <button className="button" type="submit">Login</button>
      <div className="errors">
        {errorsMessage && <h4>{errorsMessage}</h4>}
      </div>
    </form>
  )
}

export default Register
