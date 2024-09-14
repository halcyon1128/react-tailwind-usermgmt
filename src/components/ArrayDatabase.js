import { useState, useEffect } from 'react';

const ArrayDatabase = () => {
  // Initialize adminDatabase from localStorage or with default values
  useEffect(() => {
    const storedAdmin = localStorage.getItem('adminDatabase');
    if (!storedAdmin) {
      const defaultAdmin = [
        {
          id: 1,
          name: 'Calebish',
          email: 'calebish@keb.com',
          password: 'qwerty',
        },
      ];
      localStorage.setItem('adminDatabase', JSON.stringify(defaultAdmin));
    }
  }, []);

  // Initialize userDatabase from localStorage or with default values
  useEffect(() => {
    const storedUsers = localStorage.getItem('userDatabase');
    if (!storedUsers) {
      const defaultUser = [
        {
          id: 1,
          name: 'Jane Doe',
          email: 'jane@doe.com',
        },
        {
          id: 2,
          name: 'Alex Iyak-iyak',
          email: 'alex@iyak-iyak.com',
        },
      ];
      localStorage.setItem('userDatabase', JSON.stringify(defaultUser));
    }
  }, []);

  return null;
};

export default ArrayDatabase;