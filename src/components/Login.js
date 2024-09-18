import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useUserContext } from './contexts/UserContext';
// import TestComponent from './TestComponent';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { logIn, authenticateUser } = useAuth(); // Use the updated context functions
  const { userDatabase, addUser, deleteUser } = useUserContext(); // Access userDatabase, addUser, and deleteUser from UserContext
  const navigate = useNavigate();

  // Function to clean the database by deleting all users with email 'test@test.com'
  const cleanDatabase = () => {
    userDatabase.forEach((user) => {
      if (user.email === 'test@test.com') {
        deleteUser(user.id); // Call deleteUser for each 'test@test.com' user
      }
    });
  };

  // Check if 'test@test.com' exists, if not, add it
  useEffect(() => {
    const testUserExists = userDatabase.some(user => user.email === 'test@test.com');
    if (!testUserExists) {
      addUser({
        id: Date.now(),
        name: '', // Blank name as specified
        email: 'test@test.com',
        password: 'test', // Set default password
      });
    }
  }, [userDatabase, addUser]);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Regex for validating email format
    const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Define validation scenarios
    const validationErrors = {
      emailRequired: !email,
      passwordRequired: !password,
      invalidEmailFormat: !emailFormatRegex.test(email),
      emailNotExists: !userDatabase.some((user) => user.email === email),
      invalidPassword: userDatabase.some(
        (user) => user.email === email && user.password !== password
      ),
    };

    // Determine which error to set based on validation results
    switch (true) {
      case validationErrors.emailRequired:
        setError('Email is required');
        break;
      case validationErrors.passwordRequired:
        setError('Password is required');
        break;
      case validationErrors.invalidEmailFormat:
        setError('Email format is invalid');
        break;
      case validationErrors.emailNotExists:
        setError('Email does not exist');
        break;
      case validationErrors.invalidPassword:
        setError('Invalid password');
        break;
      default:
        // Use the authenticateUser function to check if credentials are valid
        const isUser = authenticateUser(email, password); // Assuming authenticateUser is for user authentication
        if (isUser) {
          logIn(email); // Set the current user
          cleanDatabase(); // Clean up test@test.com users after login
          setError(''); // Clear error message on successful login
          navigate('/users'); // Navigate to the users page
        } else {
          setError('An unexpected error occurred');
        }
        break;
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-zinc-800 pb-32 text-zinc-800">
      <div className="w-full max-w-md rounded-md bg-zinc-50 p-6 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-black text-zinc-700">
          User Management
        </h1>
        <section className="w-full text-sm">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border border-gray-300 p-2 antialiased focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border border-gray-300 p-2 antialiased focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full rounded bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600"
            >
              Login
            </button>
          </form>
        </section>
        {/* <TestComponent /> */}
      </div>
    </div>
  );
}

export default Login;