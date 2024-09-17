// src/TestComponent.js
import React from 'react';
import { useAuth } from './contexts/AuthContext';

const TestComponent = () => {
  const { logIn, logOut, isLoggedIn } = useAuth();

  const handleLogin = () => {
    logIn('test@example.com', 'password123');
  };

  const handleLogout = () => {
    logOut();
  };

  return (
    <div>
      <button onClick={handleLogin}>Log In</button>
      <button onClick={handleLogout}>Log Out</button>
      <p>Logged In: {isLoggedIn ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default TestComponent;