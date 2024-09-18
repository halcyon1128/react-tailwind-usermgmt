import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from './contexts/UserContext';
import { useArrayDatabase } from './contexts/ArrayDatabase';
import ConfirmationDialog from './ConfirmationDialog';

const SettingsForm = () => {
  const [loggedUser, setLoggedUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [submitData, setSubmitData] = useState(null);
  const navigate = useNavigate();
  const { modifyUser } = useUserContext();
  const { setCurrentUser } = useArrayDatabase();
  const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setLoggedUser(storedUser);
      setName(storedUser.name);
      setEmail(storedUser.email);
    } else {
      setError('No current user found');
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'name') setName(value);
    if (name === 'email') setEmail(value);
    if (name === 'currentPassword') setCurrentPassword(value);
    if (name === 'newPassword') setNewPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!loggedUser) {
      setError('No current user found');
      return;
    }

    // Get the userDatabase from localStorage
    const userDatabase = JSON.parse(localStorage.getItem('userDatabase')) || [];

    // Check for existing names and emails
    const nameExists = userDatabase.some(user => user.name === name && user.id !== loggedUser.id);
    const emailExists = userDatabase.some(user => user.email === email && user.id !== loggedUser.id);

    const validationErrors = {
      nameRequired: !name,
      emailRequired: !email,
      invalidEmailFormat: !emailFormatRegex.test(email),
      currentPasswordRequired: !currentPassword,
      currentPasswordIsValid: currentPassword !== loggedUser.password,
      newPasswordRequired: !newPassword,
      confirmPasswordRequired: !confirmPassword,
      confirmPasswordMismatch: confirmPassword !== newPassword,
      nameTaken: nameExists,
      emailTaken: emailExists,
    };

    switch (true) {
      case validationErrors.nameRequired:
        setError('Name cannot be empty!');
        break;
      case validationErrors.emailRequired:
        setError('Email must not be empty!');
        break;
      case validationErrors.invalidEmailFormat:
        setError('Email format is invalid');
        break;
      case validationErrors.currentPasswordRequired:
        setError('Current password is required');
        break;
      case validationErrors.currentPasswordIsValid:
        setError('Must input your current password');
        break;
      case validationErrors.newPasswordRequired:
        setError('New password is required');
        break;
      case validationErrors.confirmPasswordRequired:
        setError('Confirm password is required');
        break;
      case validationErrors.confirmPasswordMismatch:
        setError('Confirm password does not match new password');
        break;
      case validationErrors.nameTaken:
        setError('Name is already taken');
        break;
      case validationErrors.emailTaken:
        setError('Email is already taken');
        break;
      default:
        if (newPassword === currentPassword) {
          alert('New password is the same as current password!');
        }
        setSubmitData({
          id: loggedUser.id,
          name,
          email,
          password: newPassword
        });
        setShowDialog(true);
        break;
    }
  };

  const handleDialogConfirm = () => {
    if (submitData) {
      modifyUser(submitData.id, submitData);
      setCurrentUser(submitData);
      console.log('User updated:', submitData);
      console.log('User Database from Local Storage:', JSON.parse(localStorage.getItem('userDatabase')));
      setName('');
      setEmail('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      alert('Your user settings were successfully updated!');
      navigate('/users');
    }
    setShowDialog(false);
  };

  const handleDialogCancel = () => {
    setShowDialog(false);
  };

  return (
    <section className='flex-grow sm:flex sm:flex-col sm:grow-0 sm:w-5/6'>
      <div className="flex sm:flex-grow justify-center">
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
              name="currentPassword"
              value={currentPassword}
              placeholder="Current Password"
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
              placeholder="Confirm Password"
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
      {showDialog && (
        <ConfirmationDialog
          message="Are you sure you want to update your settings?"
          onConfirm={handleDialogConfirm}
          onCancel={handleDialogCancel}
        />
      )}
    </section>
  );
};

export default SettingsForm;

