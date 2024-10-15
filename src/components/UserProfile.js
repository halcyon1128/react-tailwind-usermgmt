import React, { useEffect, useState } from "react";
import { useAdmin } from "./contexts/AdminContext"; // Import the UserContext

const UserProfile = () => {
  const [userName, setUserName] = useState("No user logged in");
  const [error, setError] = useState("");
  const { getAdmin } = useAdmin(); // Get the getUser function from UserContext

  const fetchUserName = async (token) => {
    try {
      const user = await getAdmin(token); // Fetch user data using the token
      setUserName(user.name); // Set the user's name in state
    } catch (error) {
      console.error("Error fetching user name:", error);
      setError("Error fetching user name");
    }
  };

  useEffect(() => {
    const handleTokenChange = () => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        fetchUserName(authToken); // Call fetchUserName if token exists
      } else {
        setUserName("No user logged in");
      }
    };

    // Initial fetch when component mounts
    handleTokenChange();

    // Listen for localStorage changes (in case the authToken is updated)
    window.addEventListener("storage", handleTokenChange);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("storage", handleTokenChange);
    };
  }, [getAdmin]); // Add getUser as a dependency to avoid stale references

  return (
    <div>
      <h1>{error ? <p>{error}</p> : <p>{userName}</p>}</h1>
    </div>
  );
};

export default UserProfile;
