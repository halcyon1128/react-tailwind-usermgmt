import React, { useState, useEffect } from 'react';
import ConfirmationDialog from './ConfirmationDialog';
import { useNavigate } from 'react-router-dom';

const Table = () => {
  const [userDatabase, setUserDatabase] = useState([]); // Local state to hold user data
  const [showDialog, setShowDialog] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const navigate = useNavigate();

  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:6060/users'); // Adjust URL if needed
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUserDatabase(data); // Set fetched data to state
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit/${id}`); // Navigate to the EditForm with the user ID
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:6060/users/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error deleting user');
      }
      setUserDatabase((prevUsers) => prevUsers.filter(user => user.id !== id)); // Update local state
      setShowDialog(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const confirmDelete = (id) => {
    setUserIdToDelete(id);
    setShowDialog(true);
  };

  const handleDialogConfirm = () => {
    if (userIdToDelete) {
      handleDelete(userIdToDelete);
    }
  };

  const handleDialogCancel = () => {
    setShowDialog(false);
  };

  return (
    <div className="min-h-56 overflow-x-auto p-2">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-sm font-semibold uppercase tracking-tight text-gray-600">Name</th>
            <th className="px-3 py-2 text-left text-sm font-semibold uppercase tracking-tight text-gray-600">Email</th>
            <th className="px-3 py-2 text-left text-sm font-semibold uppercase tracking-tight text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {userDatabase.map((user) => (
            <tr key={user.id}>
              <td className="whitespace-nowrap px-3 py-2 text-sm font-medium text-gray-800">{user.name}</td>
              <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-600">{user.email}</td>
              <td className="flex flex-row gap-2 whitespace-nowrap px-3 py-2 text-sm font-medium">
                <button
                  onClick={() => handleEdit(user.id)} // Pass user ID to the handleEdit function
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                |
                <button
                  onClick={() => confirmDelete(user.id)} // Pass user ID to confirmDelete
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showDialog && (
        <ConfirmationDialog
          message="Delete this user?"
          onConfirm={handleDialogConfirm}
          onCancel={handleDialogCancel}
        />
      )}
    </div>
  );
};

export default Table;