import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [adminDatabase, setAdminDatabase] = useState(() => {
        const storedAdmin = localStorage.getItem('adminDatabase');
        return storedAdmin ? JSON.parse(storedAdmin) : [];
    });

    useEffect(() => {
        localStorage.setItem('adminDatabase', JSON.stringify(adminDatabase));
    }, [adminDatabase]);

    const modifyAdmin = (id, updatedAdmin) => {
        const updatedAdminDatabase = adminDatabase.map((admin) =>
            admin.id === id ? { ...admin, ...updatedAdmin } : admin
        );
        setAdminDatabase(updatedAdminDatabase);
    };


    return (
        <AdminContext.Provider value={{ adminDatabase, modifyAdmin }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdminContext = () => useContext(AdminContext);