import { Route, Routes, Navigate } from 'react-router-dom';


import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  LoginPage, PageNotFound, RoomsPage, SignupPage } from './pages';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state while checking session
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/check-session', {
          credentials: 'include', // Important to include credentials (cookies)
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } 
      } catch (err) {
        console.error('Error checking session:', err);
        navigate('/login'); // In case of an error, redirect to login
      } finally {
        setLoading(false); // End loading state
      }
    };

    checkSession();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Display a loading state until the session check is done
  }

  return (
    <Routes>
      <Route path="/PageNotFound" element={<PageNotFound />} />
      {/* Public routes for unauthenticated users */}
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </>
      ) : (
        // Redirect to protected route if authenticated user tries to access login or signup
        <>
          <Route path="/login" element={<Navigate to="/root/rooms" />} />
          <Route path="/signup" element={<Navigate to="/root/rooms" />} />
        </>
      )}

      {/* Protected routes */}
      {isAuthenticated ? (
        <>
          <Route path="/root/rooms" element={<RoomsPage />} />
        </>
      ) : (
        // Redirect to login only for protected routes
        <>
        <Route path="/root//root/rooms" element={<Navigate to="/login" />} />
        <Route path="/root/rooms/:roomId" element={<Navigate to="/login" />} />
        </>
      )}

      {/* Optional: Catch-all route for undefined paths */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/root/rooms" : "/login"} />} />
    </Routes>
  );
};

export default App;
