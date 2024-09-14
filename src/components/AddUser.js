import React from 'react';
import AddForm from './AddForm';
import { Link } from 'react-router-dom';
import AdminName from './AdminName';


function AddUsers() {

  return (
    <div className='bg-zinc-800 flex items-center justify-center py-0 sm:py-4 lg:px-20 xl:px-40 text-zinc-800'>
      <div className='bg-zinc-50 flex flex-col h-screen w-screen text-xs sm:text-md rounded-md'>
        {/* Header */}
        <section className='flex flex-row justify-between items-start font-semibold w-full h-20 sm:h-18 p-5 mb-8'>
          <h2 className='font-black text-lg sm:text-2xl w-1/6 sm:w-auto'>User Management</h2>
          <div className="flex flex-row items-center justify-between gap-2 sm:text-sm">
            <AdminName /> {/* Replaced div with UserName component */}
            <button className="text-blue-500 hover:text-blue-300 font-bold mr-1">
              <a href="/login">Logout</a>
            </button>
          </div>
        </section>
        {/* Body */}
        <div id="body" className='flex flex-col sm:flex-grow sm:flex-row text-sm sm:text-lg sm:mt-2'>
          {/* Navigation */}
          <nav className="sm:place-items-start sm:rounded-xl bg-white shadow-sm sm:shadow-lg flex flex-row sm:flex-col w-full h-auto sm:h-screen sm:w-auto items-start justify-end sm:justify-start p-2 gap-4 sm:p-5 text-sm sm:text-md font-light">
            <button>
              <Link to="/users">Users</Link>
            </button>
            <button>
              <Link to="/settings">Settings</Link>
            </button>
          </nav>
          {/* Content */}
          <div id="content" className="pt-6 gap-2 sm:flex-grow sm:gap-0 sm:rounded sm:pt-8 sm:mx-5">
            <div className="flex sm:justify-center flex-grow justify-center">

              <AddForm />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddUsers;