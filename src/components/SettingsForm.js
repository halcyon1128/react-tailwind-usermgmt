import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminContext } from './contexts/AdminContext';
import { useAuth } from './contexts/AuthContext';

const SettingsForm = () => {
  const { id } = { id: 1 }
  const { adminDatabase, modifyAdmin } = useAdminContext(); //init adminDatabase container variable
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { authenticatePassword } = useAuth();
  const navigate = useNavigate();
  const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Log admin database once upon component mount (for debug purposes)
  useEffect(() => {
    console.log(`Admin database: ${JSON.stringify(adminDatabase)}`, 'for debug purposes only; removed upon deployment');
  }, [adminDatabase]);



  useEffect(() => {
    const admin = adminDatabase.find((admin) => admin.id === parseInt(id));
    if (admin) {
      setName(admin.name);
      setEmail(admin.email);
    }
  }, [id, adminDatabase]);

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
      passwordRequired: !password,
      incorrectPassword: authenticatePassword(password) === false
    };

    switch (true) {
      case validationErrors.nameRequired:
        setError('Name cannot be empty!');
        break;
      case validationErrors.emailRequired:
        setError('Email must not be empty!');
        break;
      case validationErrors.invalidEmailFormat:
        setError('Email format is invalid')
        break
      case validationErrors.passwordRequired:
        setError('Update changes requires password');
        break
      case validationErrors.incorrectPassword: //SettingsForm.js:48
        setError('Password is incorrect');
        break;
      default:
        const updatedAdmin = {
          id: parseInt(id), // Assuming you are updating the admin with id 1
          name,
          email,
        };
        modifyAdmin(parseInt(id), updatedAdmin);
        console.log('Admin updated:', updatedAdmin);
        setName('');
        setEmail('');
        setPassword('');
        setError('');
        navigate('/users'); // redirect to /users after update
        console.log('Updated admin:', updatedAdmin)
        console.log('Current admin database:', adminDatabase)
        break;
    }
  };

  return (
    <section className='flex-grow sm:flex sm:flex-col sm:grow-0 sm:w-5/6'>
      <h1 className="pl-5 sm:text-left sm:p-0 text-lg sm:text-xl tracking-wide font-bold text-zinc-500 sm:mb-2 sm:ml-0">Settings</h1>
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
              placeholder="Admin Password"
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
              <Link to="/admins" className="w-full h-full block">
                Cancel
              </Link>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SettingsForm;