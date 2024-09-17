import React, { useEffect, useState } from 'react';

function TestComponent() {
  const [userDatabase, setUserDatabase] = useState([]);

  useEffect(() => {
    // Fetch the userDatabase from localStorage
    const data = localStorage.getItem('userDatabase');
    if (data) {
      setUserDatabase(JSON.parse(data));
    }
  }, []);

  return (
    <div className="test-component container overflow-auto max-w-sm max-h-sm mt-5 text-xs">
      <h1 className='mb-2'>Users (FOR DEBUGGING PURPOSES ONLY!!!)</h1>
      {userDatabase.length === 0 ? (
        <p>No user data available.</p>
      ) : (
        <ul>
          {userDatabase.map((user) => (
            <li key={user.id}>
              <strong>Name:</strong> {user.name} <br />
              <strong>Email:</strong> {user.email} <br />
              <strong>Password:</strong> {user.password}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TestComponent;