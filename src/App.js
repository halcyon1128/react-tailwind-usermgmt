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
import ArrayDatabase from './components/ArrayDatabase'

function AppRoutes() {
  const { isLoggedIn } = useAuth()

  return (
    <Routes>
      <Route exact path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/users" />} />
      <Route
        path={'/users'}
        element={isLoggedIn ? <Users /> : <Navigate to="/login" />}
      />
      <Route
        path={`/edit/:id`}
        element={isLoggedIn ? <Edit /> : <Navigate to="/login" />}
      />
      <Route
        path={`/settings`}
        element={isLoggedIn ? <Settings /> : <Navigate to="/login" />}
      />
      <Route
        path={`/adduser`}
        element={isLoggedIn ? <AddUser /> : <Navigate to="/login" />}
      />
      <Route
        path={`/table`}
        element={isLoggedIn ? <Table /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to={isLoggedIn ? `/users` : `/login`} />} />
    </Routes>
  )
}

function App() {
  return (
    <ArrayDatabase>
      <AdminProvider>
        <AuthProvider>
          <UserProvider>
            <Router>
              <AppRoutes />
            </Router>
          </UserProvider>
        </AuthProvider>
      </AdminProvider>
    </ArrayDatabase>
  )
}

export default App