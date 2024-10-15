import React, { createContext, useContext, useState, useEffect } from "react"; // LINE 1
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userDatabase, setUserDatabase] = useState([]);
  const [newName, setNewName] = useState(""); // State for new name
  const [newEmail, setNewEmail] = useState(""); // State for new email
  const [newPassword, setNewPassword] = useState(""); // State for new password

  // Fetch users from server when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:6060/userlist");
        setUserDatabase(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  console.log("userDatabase", userDatabase);

  //GET USER FROM DB VIA SERVER REQUEST
  const getUser = async (userId) => {
    const authToken = localStorage.getItem("authToken"); // Retrieve the authToken

    if (!authToken) {
      throw new Error("Auth token not found in localStorage");
    }

    try {
      const response = await axios.get(
        `http://localhost:6060/users/${userId}`, // Use the tokenized user ID from useParams
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Pass the authToken in the Authorization header for verification
          },
        }
      );
      return response.data; // Return user data
    } catch (error) {
      throw new Error("Error fetching user data: " + error.message);
    }
  };

  // Function to add a new user
  const addUser = async (newUser) => {
    try {
      const response = await axios.post(
        "http://localhost:6060/users",
        newUser,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setUserDatabase((prevUsers) => {
        const updatedUsers = [...prevUsers, response.data]; // response.data should contain the new user with _id
        console.log("User added:", response.data); // Log added user
        console.log("Updated user database:", updatedUsers); // Log updated database REMOVE ON DEPLOYMENT
        return updatedUsers;
      });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Function to modify an existing user (abstracted request)
  const modifyUser = async (userId, updatedUser) => {
    const authToken = localStorage.getItem("authToken"); // Fetch authToken from localStorage
    try {
      console.log("Updating User with Payload:", updatedUser);
      const response = await axios.patch(
        `http://localhost:6060/users/${userId}`, // Use the tokenized user ID from useParams
        updatedUser, // Send only the updated user data
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Pass authToken in the Authorization header
          },
        }
      );
      // Update user in local state
      setUserDatabase((prevUsers) => {
        const updatedUsers = prevUsers.map(
          (user) => (user._id === userId ? response.data : user) // Compare using _id
        );
        console.log("User updated:", response.data); // Log updated user
        return updatedUsers;
      });
      // If a new token is returned, update localStorage
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Function to delete a user by tokenized ID// Function to delete a user by ID
  const deleteUser = async (id) => {
    const authToken = localStorage.getItem("authToken"); // Fetch authToken from localStorage
    try {
      await axios.delete(`http://localhost:6060/users/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Pass authToken in the Authorization header
        },
      });
      setUserDatabase((prevUsers) => {
        const updatedUsers = prevUsers.filter((user) => user.id !== id); // Update local user database
        console.log("User deleted:", id); // Log deleted user
        return updatedUsers;
      });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // ... remaining code ...
  return (
    <UserContext.Provider
      value={{ userDatabase, getUser, addUser, modifyUser, deleteUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
