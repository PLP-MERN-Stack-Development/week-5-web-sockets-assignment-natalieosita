import React, { useState } from 'react';
import { useSocket } from '../socket/socket';

const ChatBox = () => {
  const [messageInput, setMessageInput] = useState('');
  const [recipient, setRecipient] = useState('');
  const {
    messages,
    sendMessage,
    sendPrivateMessage,
    typingUsers,
    setTyping,
    users,
    readReceipts,
    isConnected,
  } = useSocket();

  const handleSend = () => {
    if (recipient.trim()) {
      sendPrivateMessage(recipient.trim(), messageInput);
    } else {
      sendMessage(messageInput);
    }
    setMessageInput('');
    setTyping(false);
  };

  const formatTimestamp = (timestamp) =>
    new Date(timestamp).toLocaleTimeString();

  return (
    <div style={{ padding: '1rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>Real-Time Chat</h2>
      <div>
        <label>Send to (optional for private): </label>
        <input
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Recipient username"
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <input
          value={messageInput}
          onChange={(e) => {
            setMessageInput(e.target.value);
            setTyping(true);
          }}
          onBlur={() => setTyping(false)}
          placeholder="Type your message..."
          style={{ width: '100%' }}
        />
        <button onClick={handleSend}>Send</button>
      </div>

      {typingUsers.length > 0 && (
        <p style={{ fontStyle: 'italic', color: 'gray' }}>
          {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
        </p>
      )}

      <ul style={{ marginTop: '2rem' }}>
        {messages.map((msg) => (
          <li key={msg._id || msg.id} style={{ marginBottom: '1rem' }}>
            {msg.system ? (
              <span style={{ color: 'gray' }}>{msg.text}</span>
            ) : (
              <>
                <strong>
                  {msg.to
                    ? `PM from ${msg.sender} to ${msg.to}`
                    : `${msg.sender || 'You'}:`}
                </strong>{' '}
                {msg.text} {' '}
                <span style={{ fontSize: '0.8rem', color: '#888' }}>
                  ({formatTimestamp(msg.timestamp)})
                </span>
                {readReceipts.has(msg._id) && (
                  <span style={{ color: 'green', marginLeft: '0.5rem' }}>✔ Read</span>
                )}
              </>
            )}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '2rem' }}>
        <h3>🟢 Online Users</h3>
        <ul>
          {users.map((user, i) => (
            <li key={i}>{user}</li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '1rem', fontStyle: 'italic' }}>
        Connection status: {isConnected ? 'Connected' : 'Disconnected'}
      </div>
    </div>
  );
};

export default ChatBox;