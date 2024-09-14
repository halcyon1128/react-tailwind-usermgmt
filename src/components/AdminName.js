import React, { useEffect, useState } from 'react';
import { useAdminContext } from './contexts/AdminContext';
import { useAuth } from './contexts/AuthContext';


const AdminName = () => {
  const { id } = { id: 1 }; // Initialize with the given ID
  const { adminDatabase } = useAdminContext();
  const { isLoggedIn } = useAuth();
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    // Check if the user is logged in
    if (isLoggedIn) {
      // Find the current admin based on ID
      const currentAdmin = adminDatabase.find(admin => admin.id === parseInt(id));
      if (currentAdmin) {
        setAdminName(currentAdmin.name);
      }
    } else {
      setAdminName(''); // Clear name when not logged in
    }
  }, [adminDatabase, isLoggedIn]); // Update when adminDatabase or isLoggedIn changes

  useEffect(() => {
    // Re-fetch admin name if it changes in adminDatabase
    if (isLoggedIn) {
      const currentAdmin = adminDatabase.find(admin => admin.id === parseInt(id));
      if (currentAdmin) {
        setAdminName(currentAdmin.name);
      }
    }
  }, [adminDatabase]); // Update when adminDatabase changes

  return <div>{adminName || 'Name not available'}</div>;
};

export default AdminName;