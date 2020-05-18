import React, { useContext } from 'react';
import { useLocation, NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth/AuthContext';
import '../../styles/nav.css'

function Nav() {
  const { user, fire } = useContext(AuthContext);
  const route = useLocation()
  const NavComponent = user ? (
    <nav className="nav">
      <div className="nav-col">
        <NavLink to="/" className={`${route.pathname === '/' ? 'active' : null} nav-link`}>{user.username}</NavLink>
      </div>
      <div className="nav-col nav-right">
        <h4 className="nav-link" onClick={() => fire.logout()}>Logout</h4>
      </div>
    </nav>
  ) : (
      <nav className="nav">
        <div className="nav-col">
          <NavLink to="/" className={`${route.pathname === '/' ? 'active' : null} nav-link`}>Home</NavLink>
        </div>
        <div className="nav-col nav-right">
          <NavLink to="/login" className={` ${route.pathname === '/login' ? 'active' : null} nav-link`}>Login</NavLink>
          <NavLink to="/register" className={` ${route.pathname === '/register' ? 'active' : null} nav-link`}>Register</NavLink>
        </div>
      </nav>
    )

  return NavComponent;
}

export default Nav