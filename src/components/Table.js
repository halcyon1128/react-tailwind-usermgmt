import React, { useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "./contexts/UserContext";

const Table = () => {
  const { userDatabase, deleteUser } = useUserContext(); // Access userDatabase and deleteUser from context
  const [showDialog, setShowDialog] = useState(false);
  const [userIdConfirmDelete, setUserIdConfirmDelete] = useState(null); // State to hold the user ID to delete
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/edit/${id}`); // Navigate to EditForm with user tokenized id
  };

  const handleDelete = (id) => {
    if (id) {
      window.location.reload();
      deleteUser(id); // Call deleteUser with the ID
      setShowDialog(false); // Close the dialog after deletion
    }
  };

  const confirmDelete = (id) => {
    setUserIdConfirmDelete(id); // Store the ID of the user to delete
    setShowDialog(true); // Show the confirmation dialog
  };

  const handleDialogConfirm = () => {
    handleDelete(userIdConfirmDelete); // Pass the stored ID to the delete function
  };

  const handleDialogCancel = () => {
    setShowDialog(false); // Close the dialog without deleting
  };

  return (
    <div className="min-h-56 overflow-x-auto p-2">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-sm font-semibold uppercase tracking-tight text-gray-600">
              Name
            </th>
            <th className="px-3 py-2 text-left text-sm font-semibold uppercase tracking-tight text-gray-600">
              Email
            </th>
            <th className="px-3 py-2 text-left text-sm font-semibold uppercase tracking-tight text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {userDatabase.map((user) => (
            <tr key={user.id}>
              <td className="whitespace-nowrap px-3 py-2 text-sm font-medium text-gray-800">
                {user.name}
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-600">
                {user.email}
              </td>
              <td className="flex flex-row gap-2 whitespace-nowrap px-3 py-2 text-sm font-medium">
                <button
                  onClick={() => handleEdit(user.id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <span>|</span>
                <button
                  onClick={() => confirmDelete(user.id)} // Confirm delete action
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
          onConfirm={handleDialogConfirm} // Call handleDialogConfirm on confirmation
          onCancel={handleDialogCancel} // Call handleDialogCancel on cancellation
        />
      )}
    </div>
  );
};

export default Table;
