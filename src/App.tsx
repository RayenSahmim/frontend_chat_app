import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Rootpage from './pages/Rootpage'
const App = () => {
  return (
    <div>
       <Routes>
        {/* Define routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/root" element={<Rootpage />} />
      </Routes>
      
    </div>
  )
}

export default App
