import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import logo from '../../public/logo.png';
import useAuthenticatedUser from '../hooks/useAuthenticatedUser';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const { authenticatedUser, loading : authLoading, error : authError} = useAuthenticatedUser();

  if(authenticatedUser) {
    navigate('/root/rooms');
  }
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Login successful!');
        navigate('/root/rooms');
      } else {
        setError(data.message || 'An error occurred');
        message.error(data.message || 'An error occurred');
      }
    } catch (error) {
      console.log(error);
      setError('Failed to login. Please try again.');
      message.error('Failed to login. Please try again.');
    }

    setLoading(false);
  };

  return (
    <section className=" flex items-center justify-center p-4 h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center w-full max-w-md">
        <div>
          <img src={logo} alt="RaySend Logo" className="h-24 w-36 mb-4" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Welcome back to RaySend!</h2>
        <div className="w-full">
          <label htmlFor="email" className="text-lg font-medium">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 w-full border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <div className="w-full">
          <label htmlFor="password" className="text-lg font-medium">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 w-full border border-gray-300 rounded mt-1"
            required
          />
        </div>
        {error || authError && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className={`p-2 w-full bg-blue-500 text-white rounded mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading || authLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </section>
  );
};

export default LoginPage;
