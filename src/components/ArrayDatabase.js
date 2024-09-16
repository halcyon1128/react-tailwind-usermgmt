import React, { createContext, useContext, useEffect } from 'react';

// Create the context
const ArrayDatabaseContext = createContext();

// Create the provider component
const ArrayDatabase = ({ children }) => {
  // This effect initializes the admin database if not already present
  useEffect(() => {
    console.log('ArrayDatabase component is mounted - checking adminDatabase');
    const storedAdmin = localStorage.getItem('adminDatabase');
    if (!storedAdmin) {
      console.log('adminDatabase not found');
      localStorage.setItem('adminDatabase', JSON.stringify([]));
    } else {
      const parsedAdmin = JSON.parse(storedAdmin);
      if (parsedAdmin.length === 0) {
        console.log('adminDatabase is empty, setting default values');
        const defaultAdmin = [
          {
            id: 1,
            name: 'John Doe',
            email: 'john@doe.com',
            password: 'qwerty',
          },
        ];
        localStorage.setItem('adminDatabase', JSON.stringify(defaultAdmin));
        console.log('Initialized adminDatabase with default values');
      } else {
        console.log('adminDatabase already exists with values:', parsedAdmin);
      }
    }
  }, []);

  // This effect initializes the user database if not already present
  useEffect(() => {
    console.log('ArrayDatabase component is mounted - checking userDatabase');
    const storedUsers = localStorage.getItem('userDatabase');
    if (!storedUsers) {
      console.log('userDatabase not found');
      localStorage.setItem('userDatabase', JSON.stringify([]));
    } else {
      const parsedUsers = JSON.parse(storedUsers);
      if (parsedUsers.length === 0) {
        console.log('userDatabase is empty, setting default values');
        const defaultUser = [
          {
            id: 1,
            name: 'Jane Doe',
            email: 'jane@doe.com',
          },
        ];
        localStorage.setItem('userDatabase', JSON.stringify(defaultUser));
        console.log('Initialized userDatabase with default values');
      } else {
        console.log('userDatabase already exists with values:', parsedUsers);
      }
    }
  }, []);

  // Provide values or functions if needed
  return (
    <ArrayDatabaseContext.Provider value={{}}>
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