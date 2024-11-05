import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import logo from '../../public/logo.png';

const PageNotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/root/rooms');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <div className="text-center">
        <img src={logo} alt="RaySend Logo" className="h-24 w-36 mb-4 mx-auto" />
        <h1 className="text-5xl font-bold mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found.</p>
        <Button type="primary" onClick={handleGoHome}>
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default PageNotFound;
