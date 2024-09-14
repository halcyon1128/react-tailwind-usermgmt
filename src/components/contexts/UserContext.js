import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userDatabase, setUserDatabase] = useState(() => {
    const storedUsers = localStorage.getItem('userDatabase');
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

  useEffect(() => {
    localStorage.setItem('userDatabase', JSON.stringify(userDatabase));
  }, [userDatabase]);

  const addUser = (newUser) => {
    setUserDatabase((prevUsers) => [...prevUsers, newUser]);
  };

  const modifyUser = (id, updatedUser) => {
    setUserDatabase((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, ...updatedUser } : user
      )
    );
  };

  const deleteUser = (id) => {
    setUserDatabase((prevUsers) =>
      prevUsers.filter((user) => user.id !== id)
    );
  };

  return (
    <UserContext.Provider value={{ userDatabase, addUser, modifyUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);