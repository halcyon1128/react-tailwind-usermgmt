import React from 'react';
import AddForm from './AddForm';
import { Link } from 'react-router-dom';
import UserProfile from './UserProfile';
import { useAuth } from './contexts/AuthContext';
import { useArrayDatabase } from './contexts/ArrayDatabase';

function AddUsers() {
  const { logOut } = useAuth();
  const { setCurrentUser } = useArrayDatabase(); // Use the hook if needed

  const handleLogout = () => {
    logOut();
    console.log('isLoggedIn status: ', localStorage.getItem('isLoggedIn'));
    // Redirect to login page or any other necessary action
  };

  return (
    <div className="flex items-center justify-center bg-zinc-800 py-0 text-zinc-800 sm:py-4 lg:px-20 xl:px-40">
      <div className="flex flex-col h-screen w-screen rounded-md bg-zinc-50 text-xs sm:text-md">
        {/* Header */}
        <section className="flex flex-row items-start justify-between p-5 font-semibold mb-8 w-full h-20 sm:h-18">
          <h2 className="text-lg font-black sm:text-2xl w-1/6 sm:w-auto">
            User Management
          </h2>
          <div className="flex flex-row items-center justify-between gap-2 sm:text-sm">
            <UserProfile /> {/* Replaced AdminName with UserProfile */}
            <button
              onClick={handleLogout}
              className="mr-1 font-bold text-blue-500 hover:text-blue-300"
            >
              Logout
            </button>
          </div>
        </section>
        {/* Body */}
        <div className="flex flex-col sm:flex-row text-sm sm:text-lg">
          {/* Navigation */}
          <nav className="flex flex-row sm:flex-col w-full h-auto sm:h-screen items-start justify-end gap-4 bg-white p-2 text-sm font-light shadow-sm sm:w-auto sm:rounded-xl sm:p-5 sm:shadow-lg">
            <button>
              <Link to="/users">Users</Link>
            </button>
            <button>
              <Link to="/settings">Settings</Link>
            </button>
          </nav>
          {/* Content */}
          <div className="flex flex-col flex-grow pt-6 sm:pt-8 sm:mx-5">
            <div className="flex justify-center flex-grow">
              <AddForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddUsers;