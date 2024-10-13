import React, { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = () => {
  const [userName, setUserName] = useState("No user logged in");
  const [error, setError] = useState("");

  const fetchUserName = async (token) => {
    try {
      const response = await axios.post(
        "http://localhost:6060/getUserName",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserName(response.data.name);
    } catch (error) {
      console.error("Error fetching user name:", error);
      setError("Error fetching user name");
    }
  };

  useEffect(() => {
    const handleTokenChange = () => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        fetchUserName(authToken);
      } else {
        setUserName("No user logged in");
      }
    };

    // Initial fetch
    handleTokenChange();

    // Listen for storage changes
    window.addEventListener("storage", handleTokenChange);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("storage", handleTokenChange);
    };
  }, []);

  return (
    <div>
      <h1>{error ? <p>{error}</p> : <p>{userName}</p>}</h1>
    </div>
  );
};

export default UserProfile;
