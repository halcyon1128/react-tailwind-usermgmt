import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserContext } from './contexts/UserContext';
import { useAuth } from './contexts/AuthContext';

const AddForm = () => {
  const { addUser, userDatabase } = useUserContext();
  const { authenticatePassword } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'name') setName(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(''); // Clear previous error

    // Define validation scenarios
    const validationErrors = {
      nameRequired: !name,
      emailRequired: !email,
      invalidEmailFormat: !emailFormatRegex.test(email),
      emailExists: userDatabase.some(user => user.email === email),
      nameExists: userDatabase.some(user => user.name === name),
      passwordRequired: !password,
      incorrectPassword: authenticatePassword(password) === false,
    };

    switch (true) {
      case validationErrors.nameRequired:
        setError('Name must not be empty');
        break;
      case validationErrors.nameExists:
        setError('Name already exists');
        break;
      case validationErrors.emailRequired:
        setError('Email must not be empty');
        break;
      case validationErrors.invalidEmailFormat:
        setError('Email must be valid');
        break;
      case validationErrors.emailExists:
        setError('Email already exists');
        break;
      case validationErrors.passwordRequired:
        setError('Admin password is required');
        break;
      case validationErrors.incorrectPassword:
        setError('Incorrect admin password');
        break;
      default:
        const newUser = {
          id: Date.now(), // Use current timestamp as a unique ID
          name,
          email,
          password,
        };

        addUser(newUser);
        console.log('New user added:', newUser);

        // Reset form fields and error
        setName('');
        setEmail('');
        setPassword('');
        setError('');
        navigate('/users');
        break;
    }
  };

  return (
    <section className='flex-grow sm:flex sm:flex-col sm:grow-0 sm:w-5/6'>
      <h1 className="pl-5 sm:text-left sm:p-0 text-lg sm:text-xl tracking-wide font-bold text-zinc-500 sm:mb-2 sm:ml-0">Add User</h1>
      <div className="flex sm:flex-grow justify-center rounded-md bg-white shadow-md">
        <form
          className="flex max-w-xs flex-grow flex-col gap-4 py-10 text-sm sm:max-w-5/6 sm:px-10 sm:text-base"
          onSubmit={handleSubmit}
        >
          <div>
            <input
              type="text"
              name="name"
              value={name}
              placeholder="Name"
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 p-2 text-slate-500 antialiased focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Email"
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 p-2 text-slate-500 antialiased focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Password"
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 p-2 text-slate-500 antialiased focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className='flex flex-row gap-4 '>
            <button
              type="submit"
              className="w-full rounded bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600"
            >
              Add
            </button>
            <button className="w-full rounded bg-red-500 p-2 font-semibold text-white hover:bg-red-600">
              <Link to="/users" className="w-full h-full block">
                Cancel
              </Link>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddForm;