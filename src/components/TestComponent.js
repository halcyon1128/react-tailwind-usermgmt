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
    <div className="test-component container overflow-auto max-w-sm max-h-sm">
      <h1>User Database</h1>
      {userDatabase.length === 0 ? (
        <p>No user data available.</p>
      ) : (
        <ul>
          {userDatabase.map((user) => (
            <li key={user.id}>
              <strong>Name:</strong> {user.name} <br />
              <strong>Email:</strong> {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TestComponent;