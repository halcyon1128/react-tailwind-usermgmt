import React, { useEffect, useState } from 'react';
import { useAdminContext } from './contexts/AdminContext';
import { useAuth } from './contexts/AuthContext';

const AdminName = () => {
  const { id } = { id: 1 }; // Initialize with the given ID
  const { adminDatabase } = useAdminContext();
  const { isLoggedIn } = useAuth();
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    // Check if the user is logged in and adminDatabase is available
    if (isLoggedIn && adminDatabase) {
      // Find the current admin based on ID
      const currentAdmin = adminDatabase.find(admin => admin.id === parseInt(id));
      if (currentAdmin) {
        setAdminName(currentAdmin.name);
      } else {
        setAdminName(''); // Clear name if admin not found
      }
    } else {
      setAdminName(''); // Clear name when not logged in or adminDatabase is not available
    }
  }, [adminDatabase, isLoggedIn, id]); // Include id in dependency array

  return <div>{adminName || 'Name not available'}</div>;
};

export default AdminName;