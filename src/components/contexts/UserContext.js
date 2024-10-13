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
        console.log("Fetched users:", response.data); // Log fetched users REMOVE ON DEPLOYMENT //LINE 15
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Function to add a new user
  const addUser = async (newUser) => {
    try {
      const response = await axios.post("http://localhost:6060/users", newUser);
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
  const modifyUser = async (token) => {
    // Accept token as a parameter
    const authToken = localStorage.getItem("authToken"); // Fetch authToken from localStorage
    const updatedUser = {
      name: newName,
      email: newEmail,
      password: newPassword,
    };
    try {
      const response = await axios.patch(
        `http://localhost:6060/users/token`, // Use the new endpoint
        { token, authToken, updatedUser }, // Send token, authToken, and updatedUser
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Pass authToken in the Authorization header
          },
        }
      );
      // Update user in local state
      setUserDatabase((prevUsers) => {
        const updatedUsers = prevUsers.map((user) =>
          user.token === token ? response.data : user
        ); // Compare using _id
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

  // Function to delete a user
  const deleteUser = async () => {
    const token = localStorage.getItem("authToken"); // Fetch the authToken from localStorage
    try {
      await axios.delete(`http://localhost:6060/users`, {
        // No need to include token in the URL
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });
      setUserDatabase((prevUsers) => {
        const updatedUsers = prevUsers.filter((user) => user.token !== token); // Filter using token
        console.log("User deleted with token:", token); // Log deleted user ID
        console.log("Updated user database:", updatedUsers); // Log updated database REMOVE ON DEPLOYMENT
        return updatedUsers;
      });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{ userDatabase, addUser, modifyUser, deleteUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
