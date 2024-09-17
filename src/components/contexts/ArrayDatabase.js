import React, { createContext, useContext, useEffect } from 'react';

// Create the context
const ArrayDatabaseContext = createContext();

// Create the provider component
const ArrayDatabase = ({ children }) => {
  useEffect(() => {
    console.log('ArrayDatabase component is mounted - checking userDatabase');

    const initializeDatabase = () => {
      // Initialize userDatabase if it doesn't exist
      const storedUsers = localStorage.getItem('userDatabase');
      if (!storedUsers) {
        console.log('userDatabase not found');
        localStorage.setItem('userDatabase', JSON.stringify([]));
      } else {
        const parsedUsers = JSON.parse(storedUsers);
        if (parsedUsers.length === 0) {
          console.log('userDatabase is empty, setting default values');
          const defaultUsers = [
            {
              id: 1,
              name: 'John Doe',
              email: 'john@doe.com',
              password: 'qwerty',
            },
            {
              id: 2,
              name: 'Jane Doe',
              email: 'jane@doe.com',
              password: 'asdfgh',
            },
          ];
          localStorage.setItem('userDatabase', JSON.stringify(defaultUsers));
          console.log('Initialized userDatabase with default values');
        } else {
          console.log('userDatabase already exists:', parsedUsers);
        }
      }

      // Initialize currentUser if it doesn't exist
      const storedCurrentUser = localStorage.getItem('currentUser');
      if (!storedCurrentUser) {
        console.log('currentUser not found, initializing with empty object');
        localStorage.setItem('currentUser', JSON.stringify({}));
      } else {
        console.log('currentUser already exists:', JSON.parse(storedCurrentUser));
      }
    };

    initializeDatabase(); // Call the initialization function
  }, []); // <-- This runs on mount

  const setCurrentUser = (user) => {
    // Sync currentUser state with localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    console.log('currentUser set:', user);
  };

  const clearCurrentUser = () => {
    // Remove currentUser from localStorage
    localStorage.removeItem('currentUser');
    console.log('currentUser cleared');
  };

  return (
    <ArrayDatabaseContext.Provider value={{ setCurrentUser, clearCurrentUser }}>
      {children}
    </ArrayDatabaseContext.Provider>
  );
};

// Create a custom hook to use the context
export const useArrayDatabase = () => {
  const context = useContext(ArrayDatabaseContext);
  if (context === undefined) {
    throw new Error('useArrayDatabase must be used within an ArrayDatabase');
  }
  return context;
};

export default ArrayDatabase;


//currentUser