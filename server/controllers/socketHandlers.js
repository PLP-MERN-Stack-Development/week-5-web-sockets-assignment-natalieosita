import { Message } from '../models/Message.js';

export const setupChatHandlers = (socket, io) => {
  const username = socket.user.username;

  socket.broadcast.emit('chat:joined', { user: username });

  // Load message history
  Message.find({ $or: [{ to: null }, { to: username }, { sender: username }] })
    .sort({ timestamp: 1 })
    .limit(50)
    .then((msgs) => {
      socket.emit('chat:history', msgs);
    });

  // Handle new message
  socket.on('chat:message', async (data) => {
    const msg = await Message.create({
      sender: username,
      to: data.to || null,
      text: data.text,
    });

    const messageObj = msg.toObject();

    if (msg.to) {
      // Private message
      const target = [...io.sockets.values()].find(
        s => s.user?.username === msg.to
      );
      if (target) {
        target.emit('chat:message', messageObj);
        socket.emit('chat:message', messageObj);
      }
    } else {
      io.emit('chat:message', messageObj);
    }
  });

  // Read receipts
  socket.on('chat:read', async (msgId) => {
    const msg = await Message.findById(msgId);
    if (msg && !msg.readBy.includes(username)) {
      msg.readBy.push(username);
      await msg.save();
      io.emit('chat:read', msgId);
    }
  });

  socket.on('chat:typing', (status) => {
    socket.broadcast.emit('chat:typing', { user: username, status });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('chat:left', { user: username });
  });
};