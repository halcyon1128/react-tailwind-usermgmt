import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize isLoggedIn on mount
  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    console.log('Initializing isLoggedIn from localStorage:', storedIsLoggedIn);
    if (storedIsLoggedIn !== null) {
      setIsLoggedIn(JSON.parse(storedIsLoggedIn));
    } else {
      localStorage.setItem('isLoggedIn', JSON.stringify(false));
    }
  }, []);

  // Function to authenticate user credentials
  const authenticateUser = (email, password) => {
    const storedUsers = localStorage.getItem('userDatabase');
    console.log('Stored user database:', storedUsers);
    if (!storedUsers) return false;

    const userDatabase = JSON.parse(storedUsers);

    return userDatabase.some(user => user.email === email && user.password === password);
  };

  // Function to log in the user
  const logIn = (email) => {
    const storedUsers = localStorage.getItem('userDatabase');
    if (storedUsers) {
      const userDatabase = JSON.parse(storedUsers);
      const user = userDatabase.find(user => user.email === email);

      if (user) {
        setIsLoggedIn(true);
        setCurrentUser(user); // Store the full user object
        localStorage.setItem('isLoggedIn', JSON.stringify(true));
        localStorage.setItem('currentUser', JSON.stringify(user)); // Save user object to localStorage
        console.log('Login successful. Full user object stored in state and localStorage.');
      }
    } 
  };

  // Function to log out the user
  const logOut = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.setItem('isLoggedIn', JSON.stringify(false));
    localStorage.removeItem('currentUser'); // Remove the user object from localStorage
    console.log('Logged out. State and localStorage updated.');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logIn, logOut, authenticateUser, currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the context
export const useAuth = () => useContext(AuthContext);