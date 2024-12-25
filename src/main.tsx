import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { SocketProvider } from "./Providers/SocketContext";
import { NotificationsProvider } from "./Providers/NotificationsProvider";
import { RoomProvider } from "./Providers/RoomProvider";
import { CallProvider } from "./Providers/CallProvider";
ReactDOM.render(
  <BrowserRouter>
    <RoomProvider>
      <SocketProvider>
        <CallProvider>
          <NotificationsProvider>
            <App />
          </NotificationsProvider>
        </CallProvider>
      </SocketProvider>
    </RoomProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
