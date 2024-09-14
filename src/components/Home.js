// // Home.js
// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import UserName from './UserName';
// import Users from './Users';
// import AddUser from './AddUser';
// import Edit from './Edit';
// import Settings from './Settings';

// const renderComponent = (pathname) => {
//     switch (pathname) {
//         case '/users':
//             return <Users />;
//         case '/adduser':
//             return <AddUser />;
//         case '/edit':
//             return <Edit />;
//         case '/settings':
//             return <Settings />;
//         default:
//             return <Users />; // Default component if no path matches
//     }
// };

// function Home() {
//     const location = useLocation();
//     const componentToRender = renderComponent(location.pathname);

//     return (
//         <div className='bg-zinc-800 flex items-center justify-center py-0 sm:py-4 lg:px-20 xl:px-40 text-zinc-800'>
//             <div className='bg-zinc-50 flex flex-col h-screen w-screen text-xs sm:text-md rounded-md'>
//                 <section className='flex flex-row justify-between items-start font-semibold w-full h-20 sm:h-18 p-2 mb-8'>
//                     <h2 className='font-black text-lg sm:text-2xl w-1/6 sm:w-auto tracking-widest'>User Management</h2>
//                     <div className="flex flex-row items-center justify-between gap-2 sm:text-sm">
//                         <UserName />
//                         <button className="text-blue-500 hover:text-blue-300 font-bold mr-1">
//                             <a href="/login">Logout</a>
//                         </button>
//                     </div>
//                 </section>
//                 <div className='flex flex-col sm:flex-row flex-grow text-sm sm:text-lg'>
//                     {/* Left-side Nav */}
//                     <nav className="rounded-sm sm:rounded-lg bg-white shadow-sm sm:shadow-lg flex flex-row sm:flex-col w-full h-auto sm:h-1/8 sm:w-auto items-start justify-end sm:justify-start p-2 gap-4 sm:p-5 text-sm sm:text-xl tracking-widest font-light">
//                         <button>
//                             <a href="/users">Users</a>
//                         </button>
//                         <button>
//                             <a href="/settings">Settings</a>
//                         </button>
//                     </nav>

//                     {/* Main Content */}
//                     <div className="flex-grow w-full sm:w-5/6 p-6">
//                         {componentToRender}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Home;
