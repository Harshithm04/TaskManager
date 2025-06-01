import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setErrors(null);

    if (password !== confirmPassword) {
      setErrors({ non_field_errors: ['Passwords do not match.'] });
      return;
    }

    try {
      const resp = await api.post('register/', { username, email, password });
      setMessage(resp.data.message);
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ non_field_errors: ['Something went wrong.'] });
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {errors && (
        <ul style={{ color: 'red' }}>
          {Object.entries(errors).map(([key, msgs]) =>
            msgs.map((msg, idx) => (
              <li key={`${key}-${idx}`}>{msg}</li>
            ))
          )}
        </ul>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="primary">Register</button>
      </form>
      <p style={{ marginTop: '12px' }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
};

export default Register;
