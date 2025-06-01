import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No token provided.');
      return;
    }

    (async () => {
      try {
        const resp = await api.get(`verify-email/?token=${encodeURIComponent(token)}`);
        setStatus('success');
        setMessage(resp.data.message);
      } catch (err) {
        setStatus('error');
        if (err.response?.data?.error) {
          setMessage(err.response.data.error);
        } else {
          setMessage('Something went wrong.');
        }
      }
    })();
  }, [token]);

  return (
    <div>
      {status === 'verifying' && <p>Verifying your email...</p>}
      {status === 'success' && (
        <div>
          <p style={{ color: 'green' }}>{message}</p>
          <p>
            You can now <Link to="/login">log in</Link>.
          </p>
        </div>
      )}
      {status === 'error' && (
        <div>
          <p style={{ color: 'red' }}>{message}</p>
          <p>
            Please request a new verification email or <Link to="/register">register again</Link>.
          </p>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
