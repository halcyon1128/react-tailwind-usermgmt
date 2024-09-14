import React from 'react';
import Table from './Table';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import AdminName from './AdminName';

function Users() {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    console.log('isLoggedIn status: ', localStorage.getItem('isLoggedIn'));
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center bg-zinc-800 py-0 text-zinc-800 sm:py-4 lg:px-20 xl:px-40">
      <div className="sm:text-md flex h-screen w-screen flex-col rounded-md bg-zinc-50 text-xs">
        <section className="sm:h-18 mb-8 flex h-20 w-full flex-row items-start justify-between p-5 font-semibold">
          <h2 className="w-1/6 text-lg font-black sm:w-auto sm:text-2xl">
            User Management
          </h2>
          <div className="flex flex-row items-center justify-between gap-2 sm:text-sm">
            <AdminName /> {/* Replaced div with UserName component */}
            <button
              onClick={handleLogout}
              className="mr-1 font-bold text-blue-500 hover:text-blue-300"
            >
              Logout
            </button>
          </div>
        </section>
        <div className="flex flex-grow flex-col text-sm sm:flex-row sm:pr-5 sm:text-lg">
          <nav className="sm:h-1/8 sm:text-md flex h-auto w-full flex-row items-start justify-end gap-4 rounded-sm bg-white p-2 text-sm font-light shadow-sm sm:w-auto sm:flex-col sm:justify-start sm:rounded-xl sm:p-5 sm:shadow-lg">
            <button>
              <Link to="/users">Users</Link>
            </button>
            <button>
              <Link to="/settings">Settings</Link>
            </button>
          </nav>
          <div className="w-full flex-grow pt-6 sm:w-5/6 sm:pl-5">
            <div className="flex flex-row justify-between sm:mb-0 sm:ml-2 sm:items-end">
              <h1 className="ml-5 text-lg font-bold tracking-wide text-zinc-500 sm:mb-2 sm:ml-0 sm:text-xl">
                Users
              </h1>
              <button className="mb-2 mr-5 rounded bg-blue-500 p-2 text-xs font-semibold leading-none text-white hover:bg-blue-600 sm:mr-0 sm:text-sm">
                <Link to="/adduser">Add User</Link>
              </button>
            </div>
            <div className="rounded bg-white p-4 shadow-md">
              <Table />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;