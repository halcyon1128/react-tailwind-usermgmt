import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import Login from './components/Login'
import Users from './components/Users'
import Edit from './components/Edit'
import Settings from './components/Settings'
import AddUser from './components/AddUser'
import Table from './components/Table'
import { AuthProvider, useAuth } from './components/contexts/AuthContext' // Import the AuthProvider
import { UserProvider } from './components/contexts/UserContext' // Import the UserProvider
import { AdminProvider } from './components/contexts/AdminContext'

function AppRoutes() {
  const { isLoggedIn } = useAuth()
  const baseURL = process.env.PUBLIC_URL;
  console.log('baseURL: ', baseURL);

  return (
    <Routes>
      <Route exact path={`${baseURL}/login`} element={!isLoggedIn ? <Login /> : <Navigate to="/users" />} />
      <Route
        path={`${baseURL}/users`}
        element={isLoggedIn ? <Users /> : <Navigate to="/login" />}
      />
      <Route
        path={`${baseURL}/edit/:id`}
        element={isLoggedIn ? <Edit /> : <Navigate to="/login" />}
      />
      <Route
        path={`${baseURL}/settings`}
        element={isLoggedIn ? <Settings /> : <Navigate to="/login" />}
      />
      <Route
        path={`${baseURL}/adduser`}
        element={isLoggedIn ? <AddUser /> : <Navigate to="/login" />}
      />
      <Route
        path={`${baseURL}/table`}
        element={isLoggedIn ? <Table /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to={isLoggedIn ? `${baseURL}/users` : `${baseURL}/login`} />} />
    </Routes>
  )
}

function App() {
  return (
    <AdminProvider>
      <AuthProvider>
        <UserProvider>
          <Router>
            <AppRoutes />
          </Router>
        </UserProvider>
      </AuthProvider>
    </AdminProvider>
  )
}

export default App