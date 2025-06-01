import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BoardDetail from './pages/BoardDetail';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const { logout, user } = useAuth();

  return (
    <div>
      <nav style={{ backgroundColor: '#007bff', padding: '10px 20px', color: '#fff' }}>
        <Link to="/" style={{ color: '#fff', fontSize: '24px' }}>TaskManager</Link>
        {user && (
          <button
            onClick={logout}
            style={{ float: 'right', background: 'none', border: 'none', color: '#fff', fontSize: '16px' }}
          >
            Logout
          </button>
        )}
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/boards/:boardId"
            element={
              <PrivateRoute>
                <BoardDetail />
              </PrivateRoute>
            }
          />

          {/* Fallback to login for any unknown route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
