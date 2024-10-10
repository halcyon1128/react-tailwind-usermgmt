import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';

const Login = () => {
  const { login, loginError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when starting login
    const result = await login(email, password);
    setLoading(false); // Reset loading state after login attempt

    if (result.success) {
      console.log('Login successful, redirecting...');
      // Redirect or perform other actions after successful login
      localStorage.setItem('isLoggedIn', 'true'); // Set isLoggedIn to true
      window.dispatchEvent(new Event('storage')); // Dispatch storage event to notify UserProfile (CROSS TAB NAME MOUNTING)
      console.log('isLoggedIn:', localStorage.getItem('isLoggedIn'));
      console.log('token:', localStorage.getItem('authToken'));
    } else {
      console.error('Login failed:', result.error);
      // Handle login error (e.g., show a notification to the user)
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
            {loginError && <p className="text-xs text-red-500">{loginError}</p>} {/* Display error from AuthContext */}

            <button
              type="submit"
              className="w-full rounded bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Login;