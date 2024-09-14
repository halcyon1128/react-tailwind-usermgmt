import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useUserContext } from './contexts/UserContext'
import { useAuth } from './contexts/AuthContext'

const EditForm = () => {
  const { id } = useParams()
  const { userDatabase, modifyUser } = useUserContext()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { authenticatePassword } = useAuth()
  const navigate = useNavigate()
  const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  useEffect(() => {
    const user = userDatabase.find((user) => user.id === parseInt(id))
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [id, userDatabase])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    if (name === 'name') setName(value)
    if (name === 'email') setEmail(value)
    if (name === 'password') setPassword(value)
  }


  const handleSubmit = (event) => {
    event.preventDefault()
    setError('') // Clear previous error

    // Define validation scenarios
    const validationErrors = {
      emailRequired: !email,
      nameRequired: !name,
      invalidEmailFormat: !emailFormatRegex.test(email),
      emailExists: userDatabase.some((user) => user.email === email && user.id !== parseInt(id)),
      nameExists: userDatabase.some((user) => user.name === name && user.id !== parseInt(id)),
      incorrectPassword: authenticatePassword(password) === false
    }

    switch (true) {
      case validationErrors.nameRequired:
        setError('Name is required')
        break
      case validationErrors.nameExists:
        setError('Name already exists');
        break;
      case validationErrors.emailRequired:
        setError('Email is required')
        break
      case validationErrors.invalidEmailFormat:
        setError('Email format is invalid')
        break
      case validationErrors.emailExists:
        setError('Email already exists');
        break;
      case validationErrors.passwordRequired:
        setError('Password is required')
        break
      case validationErrors.incorrectPassword:
        setError('Password is incorrect')
        break
      default:
        const updatedUser = {
          id: parseInt(id),
          name,
          email,
        }
        modifyUser(parseInt(id), updatedUser)
        console.log('User updated:', updatedUser)
        setName('')
        setEmail('')
        setPassword('')
        setError('')
        navigate('/users')
        break
    }
  }




  return (
    <section className='flex-grow sm:flex sm:flex-col sm:grow-0 sm:w-5/6'>
      <h1 className="pl-5 sm:text-left sm:p-0 text-lg sm:text-xl tracking-wide font-bold text-zinc-500 sm:mb-2 sm:ml-0">Edit User</h1>
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
              <Link to="/users" className="w-full h-full block">
                Cancel
              </Link>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default EditForm


//adminDatabase