import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { setupChatHandlers } from '../controllers/socketHandlers.js';

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173' },
  });

  const chatNamespace = io.of('/chat');

  chatNamespace.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Unauthorized'));

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = payload;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  chatNamespace.on('connection', (socket) => {
    setupChatHandlers(socket, chatNamespace);
  });
};