import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isLoaded: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const newSocket = io("http://localhost:5000", { withCredentials: true });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected");
      setIsLoaded(true); // Connection established, mark as loaded
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      newSocket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isLoaded }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
