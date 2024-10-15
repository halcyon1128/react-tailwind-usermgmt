import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import axios from "axios"; // Import axios for HTTP requests
import Login from "./components/Login";
import Users from "./components/Users";
import Edit from "./components/Edit";
import Settings from "./components/Settings";
import AddUser from "./components/AddUser";
import Table from "./components/Table";
import { AuthProvider, useAuth } from "./components/contexts/AuthContext";
import { UserProvider } from "./components/contexts/UserContext";
import { AdminProvider } from "./components/contexts/AdminContext"; // Import AdminContext

// Create a utility function to check if the user exists
const checkUserExists = async (authToken) => {
  if (!authToken) return false; // If no token, user does not exist
  try {
    // Make a request to check if the user exists in the database
    const response = await axios.post("http://localhost:6060/userExists", {
      token: authToken,
    });
    return response.data.exists; // Return the existence check result
  } catch (error) {
    console.error("User validation failed:", error);
    return false; // Return false if any error occurs
  }
};

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <UserProvider>
          <Router>
            <RoutesWrapper />
          </Router>
        </UserProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

// Create a wrapper component to handle the authentication check
const RoutesWrapper = () => {
  const { token } = useAuth(); // Get the token from AuthContext
  const navigate = useNavigate();

  // Create a reusable function to navigate and reload
  const navigateAndReload = (path) => {
    navigate(path);
    window.location.reload(); // Reload the page after navigating
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !token || !checkUserExists(token) ? (
            <Login />
          ) : (
            navigateAndReload("/users") // Use the reusable function
          )
        }
      />
      <Route
        path="/users"
        element={checkUserExists(token) ? <Users /> : <Navigate to="/login" />}
      />
      <Route
        path="/edit/:id"
        element={checkUserExists(token) ? <Edit /> : <Navigate to="/login" />}
      />
      <Route
        path="/settings"
        element={
          checkUserExists(token) ? <Settings /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/adduser"
        element={
          checkUserExists(token) ? <AddUser /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/table"
        element={checkUserExists(token) ? <Table /> : <Navigate to="/login" />}
      />
      <Route
        path="*"
        element={
          <Navigate
            to={token && checkUserExists(token) ? "/users" : "/login"}
          />
        }
      />
    </Routes>
  );
};

export default App;