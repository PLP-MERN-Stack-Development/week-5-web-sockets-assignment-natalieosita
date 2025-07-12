import React, { useState } from 'react';
import { SocketProvider } from '../context/SocketContext';
import ChatBox from '../components/ChatBox';

const Home = () => {
  const [username, setUsername] = useState('');
  const [startChat, setStartChat] = useState(false);

  const handleStart = () => {
    if (username.trim()) setStartChat(true);
  };

  return startChat ? (
    <SocketProvider username={username}>
      <ChatBox />
    </SocketProvider>
  ) : (
    <div style={{ padding: 20 }}>
      <h2>Welcome to Socket.IO Chat</h2>
      <input
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleStart}>Start Chat</button>
    </div>
  );
};

export default Home;