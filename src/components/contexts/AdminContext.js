import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {

    const getAdmin = async () => {
        const token = localStorage.getItem('authToken');
        const response = await axios.post('http://localhost:6060/settings', {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data; // { name, email, currentPassword }
    };

    const patchAdmin = async ({ name, email, currentPassword, newPassword }) => {
        const token = localStorage.getItem('authToken');
        const response = await axios.patch('http://localhost:6060/settings', {
            name,
            email,
            currentPassword,
            newPassword
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token); // Update token if needed
        }
        return response.data;
    };

    return (
        <AdminContext.Provider value={{ getAdmin, patchAdmin }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);