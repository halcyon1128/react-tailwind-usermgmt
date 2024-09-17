import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUserContext } from './contexts/UserContext';
import { useArrayDatabase } from './contexts/ArrayDatabase';

const EditForm = () => {
  const { id } = useParams(); // Get the user ID from the URL
  const { userDatabase, modifyUser } = useUserContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { setCurrentUser } = useArrayDatabase();
  const navigate = useNavigate();
  const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    const user = userDatabase.find((user) => user.id === parseInt(id));
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setNewPassword(user.password);
    }
  }, [id, userDatabase]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'name') setName(value);
    if (name === 'email') setEmail(value);
    if (name === 'newPassword') setNewPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(''); // Clear previous error

    // Define validation scenarios
    const validationErrors = {
      nameRequired: !name,
      emailRequired: !email,
      newPasswordRequired: !newPassword,

      invalidEmailFormat: !emailFormatRegex.test(email),
      emailExists: userDatabase.some((user) => user.email === email && user.id !== parseInt(id)),
      nameExists: userDatabase.some((user) => user.name === name && user.id !== parseInt(id)),
      // incorrectCurrentPassword: currentPassword !== userDatabase.find((user) => user.id === parseInt(id)).password,
      passwordsDoNotMatch: newPassword !== confirmPassword,
    };

    switch (true) {
      case validationErrors.nameRequired:
        setError('Name is required');
        break;
      case validationErrors.nameExists:
        setError('Name already exists');
        break;
      case validationErrors.emailRequired:
        setError('Email is required');
        break;
      case validationErrors.invalidEmailFormat:
        setError('Email format is invalid');
        break;
      case validationErrors.emailExists:
        setError('Email already exists');
        break;
      // case validationErrors.currentPasswordRequired:
      //   setError('Current password is required');
      //   break;
      // case validationErrors.incorrectCurrentPassword:
      //   setError(`Current password is incorrect. Expected password: ${userDatabase.find((user) => user.id === parseInt(id)).password}`);
      //   break;
      case validationErrors.newPasswordRequired:
        setError('New password is required');
        break;
      case validationErrors.passwordsDoNotMatch:
        setError('New password and confirm password do not match');
        break;
      default:
        const updatedUser = {
          id: parseInt(id),
          name,
          email, //set email(object attrib) as email(from input) 
          password: newPassword, // Only update password if newPassword is provided
        };
        modifyUser(parseInt(id), updatedUser);
        setCurrentUser(updatedUser);
        console.log('User updated:', updatedUser);
        console.log('User Database from Local Storage:', userDatabase);
        setName('');
        setEmail('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        alert('Existing user updated successfully');
        navigate('/users');
        break;
    }
  };

  return (
    <section className='flex-grow sm:flex sm:flex-col sm:grow-0 sm:w-5/6'>
      <div className="flex sm:flex-grow justify-center">
        <form
          className="flex max-w-xs flex-grow flex-col gap-4 py-10 text-sm sm:max-w-5/6 sm:px-10 sm:text-base"
          onSubmit={handleSubmit}>
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
              name="newPassword"
              value={newPassword}
              placeholder="New Password"
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 p-2 text-slate-500 antialiased focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              placeholder="Confirm New Password"
              onChange={handleInputChange}
              className="w-full rounded border border-gray-300 p-2 text-slate-500 antialiased focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className='flex flex-row gap-4 '>
            <button
              type="submit"
              className="w-full rounded bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600">
              Save
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

export default EditForm;

