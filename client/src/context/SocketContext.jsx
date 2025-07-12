import React, { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '../socket/socket';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token, username } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (token && username) {
      socket.auth = { token };
      socket.connect();

      socket.on('connect', () => setIsConnected(true));
      socket.on('disconnect', () => setIsConnected(false));

      return () => {
        socket.off('connect');
        socket.off('disconnect');
      };
    }
  }, [token, username]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);