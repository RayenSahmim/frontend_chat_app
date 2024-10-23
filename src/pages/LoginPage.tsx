import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loginImage from '../../public/images.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if the user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/check-session', {
          credentials: 'include', // Important to include credentials (cookies)
        });
        if (response.ok) {
          navigate('/root/rooms'); // Redirect if session exists
        }
      } catch (err) {
        console.error('Error checking session:', err);
      }
    };

    checkSession();
  }, [navigate]);

  const handleSubmit = async (event  : React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        credentials: 'include', // Important to include credentials (cookies)
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Success:', data);
        // No need to set cookies manually anymore

        // Redirect to the root page after login
        navigate('/root');
      } else {
        setError(data.message || 'An error occurred');
      }
    } catch (error) {
      console.log(error);
      setError('Failed to login. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="min-h-screen flex items-center justify-center lg:w-1/3">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
          <div className="w-full max-w-sm">
            <label htmlFor="email" className="text-2xl">Email</label>
            <input
              type="email"
              id="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 w-full border border-gray-700 rounded"
              required
            />
          </div>

          <div className="w-full max-w-sm">
            <label htmlFor="password" className="text-2xl">Password</label>
            <input
              type="password"
              id="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 w-full border border-gray-700 rounded"
              required
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            className={`p-2 w-full max-w-sm bg-blue-500 rounded text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
      <div className="w-full hidden lg:flex lg:w-2/3 border-l-[1px] border-black">
        <img
          src={loginImage}
          alt="login image"
          className="w-full h-screen object-cover"
        />
      </div>
    </div>
  );
};

export default LoginPage;
