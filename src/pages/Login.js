import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const resp = await api.post('token/', { username, password });
      // resp.data = { access: "...", refresh: "..." }
      // We also want to store user info—either decode JWT or fetch /api/protected/.
      // For simplicity, store just username. If you want user_id, decode the token or add an endpoint to fetch user.
      const access = resp.data.access;
      const refresh = resp.data.refresh;
      const userData = { username }; // minimal; if you need id, decode or fetch separately

      login({ access, refresh, userData });
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid credentials or account not verified.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="primary">Log In</button>
      </form>
      <p style={{ marginTop: '12px' }}>
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
