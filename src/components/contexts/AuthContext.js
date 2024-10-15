import React, { createContext, useContext, useState } from "react";
import axios from "axios";

// Create the context
const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null); // Store only the token
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState(""); // State for login errors

  // Function to login and store the token
  const login = async (email, password) => {
    // Check if a token exists
    if (token) {
      // If a token exists, logout first
      logout();
    }

    try {
      const response = await axios.post("http://localhost:6060/login", {
        email,
        password,
      });

      // Check response status and data
      if (response.status === 200) {
        const { token } = response.data; // Get token
        localStorage.setItem("authToken", token); // Store the access token
        setToken(token); // Update state with the token
        setIsLoggedIn(true); // Update logged-in state
        setLoginError(""); // Clear any previous error
        return { success: true }; // Indicate success
      }
    } catch (error) {
      // Log the error response for debugging
      console.error(
        "Error during login:",
        error.response?.data?.message || "Login failed. Please try again."
      );
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      setLoginError(errorMessage); // Set specific error message from response
      return { success: false, error: errorMessage }; // Indicate failure with error message
    }
  };

  const logout = () => {
    // Clear the token from local storage
    localStorage.removeItem("authToken");
    setToken(null); // Clear the token state
    setIsLoggedIn(false); // Update the logged-in state
    console.log("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{ token, isLoggedIn, login, logout, loginError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
