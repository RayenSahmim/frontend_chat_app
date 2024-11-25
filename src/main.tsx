import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { SocketProvider } from './Providers/SocketContext';
ReactDOM.render(
  <BrowserRouter>
  <SocketProvider>
    <App />
  </SocketProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
