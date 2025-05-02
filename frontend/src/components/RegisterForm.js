import React, { useState, useEffect } from 'react';
import './AuthForms.css';

function RegisterForm({ onRegister, onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    console.log('Error state:', error);
    console.log('Success state:', success);
  }, [error, success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      console.log('Register response status:', response.status);
      console.log('Register response data:', data);
      if (response.ok) {
        setSuccess('Registration successful! You can now log in.');
        onRegister();
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Register</button>
      <p style={{ marginTop: '15px' }}>
        If you have an account,{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          style={{ color: '#007bff', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '1rem' }}
        >
          login
        </button>
      </p>
    </form>
  );
}

export default RegisterForm;
