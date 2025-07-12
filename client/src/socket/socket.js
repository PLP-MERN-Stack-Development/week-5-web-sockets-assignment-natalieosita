import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Connect to /chat namespace
export const socket = io(`${SOCKET_URL}/chat`, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const useSocket = () => {
  const { token, username } = useAuth();

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [readReceipts, setReadReceipts] = useState(new Set());

  const connect = () => {
    if (token) {
      socket.auth = { token };
      socket.connect();

      socket.once('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
      });
    }
  };

  const disconnect = () => {
    socket.disconnect();
  };

  const sendMessage = (text, to = null) => {
    socket.emit('chat:message', { text, to });
  };

  const setTyping = (isTyping) => {
    socket.emit('chat:typing', isTyping);
  };

  const markAsRead = (msgId) => {
    socket.emit('chat:read', msgId);
  };

  // Handle all socket events
  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    const onMessage = (msg) => {
      setLastMessage(msg);
      setMessages((prev) => [...prev, msg]);
      if (msg._id) markAsRead(msg._id);
    };

    const onHistory = (chatHistory) => {
      setMessages(chatHistory);
    };

    const onReadReceipt = (msgId) => {
      setReadReceipts((prev) => new Set(prev).add(msgId));
    };

    const onTyping = ({ user }) => {
      setTypingUsers((prev) => {
        const set = new Set(prev);
        if (user) set.add(user);
        else set.delete(user);
        return [...set];
      });
    };

    const onUserUpdate = (userList) => {
      setUsers(userList);
    };

    const onSystemEvent = (text) => {
      setMessages((prev) => [
        ...prev,
        {
          _id: `sys-${Date.now()}`,
          system: true,
          text,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('chat:history', onHistory);
    socket.on('chat:message', onMessage);
    socket.on('chat:read', onReadReceipt);
    socket.on('chat:typing', onTyping);
    socket.on('chat:joined', ({ user }) => onSystemEvent(`${user} joined`));
    socket.on('chat:left', ({ user }) => onSystemEvent(`${user} left`));
    socket.on('chat:users', onUserUpdate);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('chat:history', onHistory);
      socket.off('chat:message', onMessage);
      socket.off('chat:read', onReadReceipt);
      socket.off('chat:typing', onTyping);
      socket.off('chat:joined');
      socket.off('chat:left');
      socket.off('chat:users', onUserUpdate);
    };
  }, [token]);

  return {
    socket,
    isConnected,
    messages,
    lastMessage,
    users,
    typingUsers,
    readReceipts,
    connect,
    disconnect,
    sendMessage,
    setTyping,
  };
};

export default socket;