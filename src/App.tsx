import { Route, Routes } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  LoginPage, PageNotFound, RoomsPage, SignupPage,ProfilePage ,HomePage, AboutPage,ContactPage} from './pages';
import MainLayout from './layouts/MainLayout';

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
      <Route path="/" element={<MainLayout children={<HomePage/>}/>} />
      <Route path="/login" element={<MainLayout children={<LoginPage/>}/>} />
      <Route path="/signup" element={<MainLayout children={<SignupPage/>}/>} />
      <Route path="/about" element={<MainLayout children={<AboutPage/>}/>} />
      <Route path="/contact" element={<MainLayout children={<ContactPage/>}/>} />

      
      <Route path="/root/rooms" element={<RoomsPage />} />
      <Route path="/root/Profile/:id" element={< ProfilePage/>} />

       <Route path="*" element={<MainLayout children={<PageNotFound/>}/>} />

    </Routes>
  );
};

export default App;
