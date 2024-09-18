import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useUserContext } from './contexts/UserContext';
import { useArrayDatabase } from './contexts/ArrayDatabase';
import TestComponent from './TestComponent';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [showTestComponent, setShowTestComponent] = useState(false);
  const { logIn, authenticateUser } = useAuth();
  const { userDatabase } = useUserContext();
  const { setCurrentUser } = useArrayDatabase();
  const navigate = useNavigate();

  // Regex for validating email format
  const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = {
      emailRequired: !email,
      passwordRequired: !password,
      invalidEmailFormat: !emailFormatRegex.test(email),
      emailNotExists: !userDatabase.some((user) => user.email === email),
      invalidPassword: userDatabase.some(
        (user) => user.email === email && user.password !== password
      ),
    };

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
        setIncorrectAttempts((prev) => prev + 1);
        break;
      default:
        const isUser = authenticateUser(email, password);
        if (isUser) {
          setCurrentUser({ email });
          logIn(email);
          setError('');
          setIncorrectAttempts(0); // Reset attempts on successful login
          navigate('/users');
        } else {
          setError('An unexpected error occurred');
        }
        break;
    }
  };

  // Show TestComponent on "Forget password?" click
  const handleForgetPasswordClick = () => {
    setShowTestComponent(true);
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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

          {/* Show the "Forget password?" link after 3 incorrect attempts */}
          {incorrectAttempts >= 3 && (
            <p
              className="mt-4 cursor-pointer text-blue-500 hover:underline"
              onClick={handleForgetPasswordClick}
            >
              Forget password?
            </p>
          )}
        </section>

        {/* Wrap TestComponent in a hidden container */}
        <div className={showTestComponent ? '' : 'hidden'}>
          <TestComponent />
        </div>
      </div>
    </div>
  );
}

export default Login;