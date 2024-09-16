import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { useAdminContext } from './contexts/AdminContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { logIn, authenticateAdmin } = useAuth() // Get functions and databases from context
  const { adminDatabase } = useAdminContext()
  const navigate = useNavigate()

  // Fetch adminDatabase from local storage and log it
  useEffect(() => {
    const storedAdminDatabase = localStorage.getItem('adminDatabase')
    if (storedAdminDatabase) {
      const adminDatabase = JSON.parse(storedAdminDatabase)
      console.log('Admin Database from Local Storage:', adminDatabase)
    } else {
      console.log('No admin database found in local storage.')
    }
  }, [])

  // Regex for validating email format
  const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const handleInputChange = (event) => {
    const { name, value } = event.target
    if (name === 'email') setEmail(value)
    if (name === 'password') setPassword(value)
  }

  const handleInputFocus = () => {
    setError('') // Clear the error message when input is focused
  }



  //PRINTS ADMIN IN CONSOLE: REMOVE ON DEPLOYMENT
  // Log admin database once upon component mount
  useEffect(() => {
    console.log(`Admin database: ${JSON.stringify(adminDatabase)}`, 'for debug purposes only; removed upon deployment');
  }, [adminDatabase]); // Dependency ensures the effect runs when adminDatabase changes

  // Inside handleSubmit
  console.log('Email:', email)
  console.log('Password:', password)
  console.log('Admin Database:', adminDatabase)
  console.log('Is Admin:', authenticateAdmin(email, password))

  const handleSubmit = (event) => {
    event.preventDefault()

    // Define validation scenarios
    const validationErrors = {
      emailRequired: !email,
      passwordRequired: !password,
      invalidEmailFormat: !emailFormatRegex.test(email),
      emailNotExists: !adminDatabase.some((admin) => admin.email === email),
      invalidPassword: adminDatabase.some(
        (admin) => admin.email === email && admin.password !== password
      ),
    }

    // Determine which error to set based on validation results
    switch (true) {
      case validationErrors.emailRequired:
        setError('Email is required')
        break
      case validationErrors.passwordRequired:
        setError('Password is required')
        break
      case validationErrors.invalidEmailFormat:
        setError('Email format is invalid')
        break
      case validationErrors.emailNotExists:
        setError('Email does not exist')
        break
      case validationErrors.invalidPassword:
        setError('Invalid password')
        break
      default:
        // Use the authenticateAdmin function to check if credentials are valid
        const isAdmin = authenticateAdmin(email, password)
        if (isAdmin) {
          logIn(email) // Set the current user
          setError('') // Clear error message on successful login
          console.log(``)
          navigate('/users')
        } else {
          setError('An unexpected error occurred')
        }
        break
    }


  }

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
                onFocus={handleInputFocus} // Add focus handler
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
                onFocus={handleInputFocus} // Add focus handler
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

            <p className='text-xs text-red-500 text-center font-semibold'> if ArrayDatabase test div does not show up it did not load</p>
          </form>
        </section>
      </div>
    </div>
  )
}

export default Login

//userDatabase
