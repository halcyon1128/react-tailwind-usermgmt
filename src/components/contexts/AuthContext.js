import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize isLoggedIn state from localStorage or default to false
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    return storedIsLoggedIn === 'true'; // Convert 'true' string to boolean
  });

  useEffect(() => {
    // Sync isLoggedIn state with localStorage
    localStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  const logIn = () => {
    setIsLoggedIn(true);
  };

  const logOut = () => {
    setIsLoggedIn(false);
  };

  const authenticateAdmin = (email, password) => {
    const storedAdmin = localStorage.getItem('adminDatabase');
    if (!storedAdmin) return false;

    const adminDatabase = JSON.parse(storedAdmin);
    return adminDatabase.some(admin => admin.email === email && admin.password === password);
  };

  const authenticatePassword = (password) => {
    const storedAdmin = localStorage.getItem('adminDatabase');
    if (!storedAdmin) return false;

    const adminDatabase = JSON.parse(storedAdmin);
    return adminDatabase.some(admin => admin.password === password);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logIn, logOut, authenticateAdmin, authenticatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);