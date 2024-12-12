import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { SocketProvider } from './Providers/SocketContext';
import { NotificationsProvider } from './Providers/NotificationsProvider';
ReactDOM.render(
  <BrowserRouter>
  <SocketProvider>
    <NotificationsProvider>
    <App />
    </NotificationsProvider>
  </SocketProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
