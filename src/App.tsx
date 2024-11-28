import { Route, Routes } from 'react-router-dom';

import {  LoginPage, PageNotFound, RoomsPage, SignupPage,ProfilePage ,HomePage, AboutPage,ContactPage} from './pages';
import MainLayout from './layouts/MainLayout';

const App = () => {
 

  

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
