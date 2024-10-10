import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userDatabase, setUserDatabase] = useState([]);

  // Fetch users from server when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:6060/users');
        setUserDatabase(response.data);
        console.log('Fetched users:', response.data); // Log fetched users REMOVE ON DEPLOYMENT
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Function to add a new user
  const addUser = async (newUser) => {
    try {
      const response = await axios.post('http://localhost:6060/users', newUser);
      setUserDatabase((prevUsers) => {
        const updatedUsers = [...prevUsers, response.data];
        console.log('User added:', response.data); // Log added user
        console.log('Updated user database:', updatedUsers); // Log updated database REMOVE ON DEPLOYMENT
        return updatedUsers;
      });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Function to modify an existing user (abstracted request)
  const modifyUser = async (id, updatedUser) => {
    try {
      const token = localStorage.getItem('authToken'); // Get the token from localStorage

      const response = await axios.patch(`http://localhost:6060/users/${id}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in the Authorization header
        },
      });

      // Update user in local state
      setUserDatabase((prevUsers) => {
        const updatedUsers = prevUsers.map((user) => (user.id === id ? response.data : user));
        console.log('User updated:', response.data); // Log updated user (REMOVE ON DEPLOYMENT)
        console.log('Updated user database:', updatedUsers); // Log updated database (REMOVE ON DEPLOYMENT)
        return updatedUsers;
      });

      // If a new token is returned, update localStorage
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }

    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Function to delete a user
  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:6060/users/${id}`);
      setUserDatabase((prevUsers) => {
        const updatedUsers = prevUsers.filter((user) => user.id !== id);
        console.log('User deleted with ID:', id); // Log deleted user ID
        console.log('Updated user database:', updatedUsers); // Log updated database REMOVE ON DEPLOYMENT
        return updatedUsers;
      });
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <UserContext.Provider value={{ userDatabase, addUser, modifyUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);