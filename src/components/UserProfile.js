import React, { useEffect, useState } from 'react';
import { useAuth } from './contexts/AuthContext'; // Adjust the path as needed

const UserProfile = () => {
  const { isLoggedIn } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log(`isLoggedIn: ${isLoggedIn}`);
    if (isLoggedIn) {
      // Get the currentUser from localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      console.log('currentUser:' + localStorage.getItem('currentUser'));
      setUser(currentUser);
    } else {
      setUser(null); // Clear user if not logged in
    }
  }, [isLoggedIn]); // Depend only on isLoggedIn

  // Function to handle storage changes
  const handleStorageChange = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    setUser(currentUser);
  };

  useEffect(() => {
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div>
      {isLoggedIn && user ? (
        <p>{user.name}</p>
      ) : (
        <p>Please log in to see your profile.</p>
      )}
    </div>
  );
};

export default UserProfile;