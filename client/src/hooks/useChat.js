import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';

export const useChat = (recipient = null) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [readStatus, setReadStatus] = useState({});

  useEffect(() => {
    socket.on('chat:message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      socket.emit('chat:read', msg.id);
    });

    socket.on('chat:typing', (status) => setTyping(status));
    socket.on('chat:read', (msgId) => {
      setReadStatus((prev) => ({ ...prev, [msgId]: true }));
    });

    return () => {
      socket.off('chat:message');
      socket.off('chat:typing');
      socket.off('chat:read');
    };
  }, [socket]);

  const sendMessage = (text) => {
    const message = {
      id: Date.now().toString(),
      to: recipient,
      text,
      timestamp: Date.now(),
    };
    socket.emit('chat:message', message);
    setMessages((prev) => [...prev, message]);
  };

  const emitTyping = (status) => socket.emit('chat:typing', status);

  return { messages, sendMessage, emitTyping, typing, readStatus };
};