// import React, { createContext, useContext, useState } from 'react';

// const ArrayDatabaseContext = createContext();

// const ArrayDatabase = ({ children }) => {
//   const [currentUserVerified, setCurrentUserVerified] = useState(false);

//   // Set current user (on login)
//   const setCurrentUser = async (user) => {
//     try {
//       const response = await fetch('http://localhost:6060/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(user),
//       });
//       const currentUser = await response.json();
//       if (currentUser && currentUser.isLoggedIn) {
//         setCurrentUserVerified(true);
//         console.log('currentUser set:', currentUser);
//       }
//     } catch (error) {
//       console.error('Error setting current user:', error);
//     }
//   };

//   // Clear current user (on logout)
//   const clearCurrentUser = async () => {
//     try {
//       const response = await fetch('http://localhost:6060/logout', {
//         method: 'POST',
//       });
//       if (response.ok) {
//         setCurrentUserVerified(false);
//         console.log('currentUser cleared');
//       }
//     } catch (error) {
//       console.error('Error clearing current user:', error);
//     }
//   };

//   return (
//     <ArrayDatabaseContext.Provider value={{ currentUserVerified, setCurrentUser, clearCurrentUser }}>
//       {children}
//     </ArrayDatabaseContext.Provider>
//   );
// };

// export const useArrayDatabase = () => {
//   const context = useContext(ArrayDatabaseContext);
//   if (!context) {
//     throw new Error('useArrayDatabase must be used within an ArrayDatabase');
//   }
//   return context;
// };

// export default ArrayDatabase;