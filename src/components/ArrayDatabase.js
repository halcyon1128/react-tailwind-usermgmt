// // ArrayDatabase.js
// import React, { createContext, useContext, useEffect } from 'react';

// // Create the context
// const ArrayDatabaseContext = createContext();

// // Create the provider component
// const ArrayDatabase = ({ children }) => {
//   useEffect(() => {
//     const storedAdmin = localStorage.getItem('adminDatabase');
//     if (!storedAdmin) {
//       const defaultAdmin = [
//         {
//           id: 1,
//           name: 'Calebish',
//           email: 'calebish@keb.com',
//           password: 'qwerty',
//         },
//       ];
//       localStorage.setItem('adminDatabase', JSON.stringify(defaultAdmin));
//     }
//   }, []);

//   useEffect(() => {
//     const storedUsers = localStorage.getItem('userDatabase');
//     if (!storedUsers) {
//       const defaultUser = [
//         {
//           id: 1,
//           name: 'Jane Doe',
//           email: 'jane@doe.com',
//         },
//         {
//           id: 2,
//           name: 'Alex Iyak-iyak',
//           email: 'alex@iyak-iyak.com',
//         },
//       ];
//       localStorage.setItem('userDatabase', JSON.stringify(defaultUser));
//     }
//   }, []);

//   // Provide values or functions if needed
//   return (
//     <ArrayDatabaseContext.Provider value={{}}>
//       {children}
//     </ArrayDatabaseContext.Provider>
//   );
// };

// // Create a custom hook to use the context
// export const useArrayDatabase = () => {
//   const context = useContext(ArrayDatabaseContext);
//   if (context === undefined) {
//     throw new Error('useArrayDatabase must be used within an ArrayDatabase');
//   }
//   return context;
// };

// export default ArrayDatabase;

import React, { createContext, useContext, useEffect } from 'react';

// Create the context
const ArrayDatabaseContext = createContext();

// Create the provider component
const ArrayDatabase = ({ children }) => {
  useEffect(() => {
    const storedAdmin = localStorage.getItem('adminDatabase');
    if (!storedAdmin) {
      const defaultAdmin = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@doe.com',
          password: 'qwerty',
        },
      ];
      localStorage.setItem('adminDatabase', JSON.stringify(defaultAdmin));
      console.log('Initialized adminDatabase with default values');
    } else {
      console.log('adminDatabase already exists');
    }
  }, []);

  useEffect(() => {
    const storedUsers = localStorage.getItem('userDatabase');
    if (!storedUsers) {
      const defaultUser = [
        {
          id: 1,
          name: 'Jane Doe',
          email: 'jane@doe.com',
        },
      ];
      localStorage.setItem('userDatabase', JSON.stringify(defaultUser));
      console.log('Initialized userDatabase with default values');
    } else {
      console.log('userDatabase already exists');
    }
  }, []);

  // Provide values or functions if needed
  return (
    <ArrayDatabaseContext.Provider value={{}}>
      {children}
    </ArrayDatabaseContext.Provider>
  );
};

// Create a custom hook to use the context
export const useArrayDatabase = () => {
  const context = useContext(ArrayDatabaseContext);
  if (context === undefined) {
    throw new Error('useArrayDatabase must be used within an ArrayDatabase');
  }
  return context;
};

export default ArrayDatabase;