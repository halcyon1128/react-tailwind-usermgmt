import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode'; // Correct named import

const UserProfile = () => {
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');

  // Function to fetch the user's name based on the token
  const fetchUserName = async () => {
    try {
      const authToken = localStorage.getItem('authToken'); // Get the token from localStorage
      if (authToken) {
        // Call the server to get the user's name using the token in the Authorization header
        const response = await axios.post(
          'http://localhost:6060/getUserName',
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        // Set the user's name from the server's response
        if (response.data.name) {
          setUserName(response.data.name);
        } else {
          setUserName('User not found');
        }
      } else {
        setUserName('No user logged in');
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
      setError('Error fetching user name');
    }
  };

  useEffect(() => {
    // Fetch the user's name on component mount
    fetchUserName();

    // Event listener to detect changes in localStorage (authToken)
    const handleStorageChange = (event) => {
      if (event.key === 'authToken') {
        fetchUserName(); // Re-fetch the user's name if the token changes
      }
    };

    // Add the event listener to detect token changes
    window.addEventListener('storage', handleStorageChange);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Empty dependency array to run only once on mount

  return (
    <div>
      {error && <p>{error}</p>}
      <h1>{userName || 'Loading...'}</h1>
    </div>
  );
};

export default UserProfile;