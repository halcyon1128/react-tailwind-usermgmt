import React from 'react';
import AddForm from './AddForm';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import UserProfile from './UserProfile';

function AddUsers() {
  const { logout } = useAuth(); // Use the logout function from AuthContext
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Log the user out
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="flex items-center justify-center bg-zinc-800 py-0 text-zinc-800 sm:py-4 lg:px-20 xl:px-40">
      <div className="flex flex-col h-screen w-screen rounded-md bg-zinc-50 text-xs sm:text-md">
        <header className="mb-8 flex h-20 w-full flex-row items-start justify-between p-5 font-semibold">
          <h2 className="text-lg font-black sm:text-2xl">User Management</h2>
          <div className="flex items-center gap-2 sm:text-sm">
            <UserProfile />
            <button
              onClick={handleLogout}
              className="mr-1 font-bold text-blue-500 hover:text-blue-300"
            >
              Logout
            </button>
          </div>
        </header>
        <div className="flex flex-col sm:flex-row text-sm sm:text-lg">
          <nav className="flex flex-row sm:flex-col w-full h-auto sm:h-screen items-start justify-end gap-4 bg-white p-2 text-sm font-light shadow-sm sm:w-auto sm:rounded-xl sm:p-5 sm:shadow-lg">
            <Link to="/users" className="hover:text-blue-500">Users</Link>
            <Link to="/settings" className="hover:text-blue-500">Settings</Link>
          </nav>
          <main className="flex-grow pt-6 sm:pt-8 sm:mx-5">
            <div className="flex justify-center flex-grow">
              <AddForm />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default AddUsers;