import { useState, useEffect } from 'react';

interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  ImageURL: string
} 

const useAuthenticatedUser = () => {
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthenticatedUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/check-session', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setAuthenticatedUser(data.user);
    } catch (err) {
      console.error('Error fetching authenticated user:', err);
      setError('Failed to fetch authenticated user.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAuthenticatedUser();
  }, []);

  return { authenticatedUser, loading, error };
};

export default useAuthenticatedUser;
