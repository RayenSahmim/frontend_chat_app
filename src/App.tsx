import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChatPage from './pages/ChatPage';
import RoomsPage from './pages/RoomsPage';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        } else {
          navigate('/login'); // Redirect to login if session is invalid
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
    <div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {isAuthenticated ? (
          <>
            <Route path="/root/rooms" element={<RoomsPage />} />
            <Route path="/root/rooms/:roomId" element={<ChatPage />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </div>
  );
};

export default App;
