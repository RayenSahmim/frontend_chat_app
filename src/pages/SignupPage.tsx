import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import logo from '../../public/logo.png';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/check-session', {
          credentials: 'include',
        });
        if (response.ok) {
          navigate('/root/rooms');
        }
      } catch (err) {
        console.error('Error checking session:', err);
      }
    };

    checkSession();
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Signup successful!');
        navigate('/login');
      } else {
        setError(data.message || 'An error occurred');
        message.error(data.message || 'An error occurred');
      }
    } catch (error) {
      console.log(error);
      setError('Failed to signup. Please try again.');
      message.error('Failed to signup. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center w-full max-w-md">
        {/* Placeholder for logo */}
        <div>
          <img src={logo} alt="RaySend Logo" className="h-24 w-36" />
        </div>
        <h2 className="text-3xl font-bold mb-2">RaySend Sign Up</h2>
        <p className="text-gray-600 mb-6">Join RaySend to start messaging with your friends and family.</p>
        <div className="w-full">
          <label htmlFor="name" className="text-lg font-medium">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 w-full border border-gray-300 rounded mt-1"
            required
          />
        </div>
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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 w-full border border-gray-300 rounded mt-1"
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className={`p-2 w-full bg-blue-500 text-white rounded mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
