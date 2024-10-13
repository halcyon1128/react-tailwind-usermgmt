import React, { useState, useEffect } from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "./contexts/UserContext";

const Table = () => {
  const { userDatabase, deleteUser } = useUserContext(); // Access userDatabase and deleteUser from context
  const [showDialog, setShowDialog] = useState(false);
  const [userTokenToDelete, setUserTokenToDelete] = useState(null);
  const navigate = useNavigate();

  const handleEdit = (token) => {
    navigate(`/edit/${token}`); // Navigate to EditForm with user token
  };

  const handleDelete = () => {
    if (userTokenToDelete) {
      deleteUser(userTokenToDelete);
      setShowDialog(false);
    }
  };

  const confirmDelete = (token) => {
    setUserTokenToDelete(token);
    setShowDialog(true);
  };

  const handleDialogConfirm = () => {
    handleDelete();
  };

  const handleDialogCancel = () => {
    setShowDialog(false);
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
            <tr key={user.token}>
              <td className="whitespace-nowrap px-3 py-2 text-sm font-medium text-gray-800">
                {user.name}
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-600">
                {user.email}
              </td>
              <td className="flex flex-row gap-2 whitespace-nowrap px-3 py-2 text-sm font-medium">
                <button
                  onClick={() => handleEdit(user.token)} // Navigate using the user token
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <span>|</span>
                <button
                  onClick={() => confirmDelete(user.token)}
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
