import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Random User Data
const users = [
  {
    id: 1,
    name: 'Alice',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: 2,
    name: 'Bob',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: 3,
    name: 'Charlie',
    avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
  },
  {
    id: 4,
    name: 'Diana',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
];

const ChatSection = () => {
  const [chatHistories, setChatHistories] = useState({}); // Store chat histories
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser , setSelectedUser ] = useState(users[0]);

  // Initialize Socket.io client
  const socket = io('http://localhost:5000'); // Replace with your backend URL

  useEffect(() => {
    // Listen for incoming messages
    socket.on('receive-message', (message) => {
      setChatHistories((prevHistories) => {
        const userId = message.userId;
        return {
          ...prevHistories,
          [userId]: [...(prevHistories[userId] || []), message],
        };
      });
    });

    return () => {
      socket.off('receive-message');
    };
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      sender: 'You',
      content: newMessage,
      time: new Date().toLocaleTimeString(),
      userId: selectedUser .id,
    };

    // Emit the message to the server
    socket.emit('send-message', message);

    // Update the local state with the new message
    setChatHistories((prevHistories) => {
      return {
        ...prevHistories,
        [selectedUser .id]: [...(prevHistories[selectedUser .id] || []), message],
      };
    });
    setNewMessage('');
  };

  return (
    <div className="chat-container h-[80vh] border-2 rounded-2xl">
      <div className="user-list">
        {users.map((user) => (
          <div
            key={user.id}
            className={`user-item ${selectedUser .id === user.id ? 'active' : ''}`}
            onClick={() => setSelectedUser (user)}
          >
            <img src={user.avatar} alt={user.name} className="user-avatar" />
            <span className="user-name">{user.name}</span>
          </div>
        ))}
      </div>

      <div className="chat-area">
        <div className="current-user">
          <h2>Chatting with: {selectedUser .name}</h2>
        </div>
        <div className="messages">
          {chatHistories[selectedUser .id]?.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender === 'You' ? 'message-sent' : 'message-received'}`}
            >
              {message.sender !== 'You' && (
                <img
                  src={users.find((user) => user.id === message.userId)?.avatar}
                  alt="User  Avatar"
                  className="message-avatar"
                />
              )}
              <div className="message-content">
                <p>{message.content}</p>
                <span className="message-time">{message.time}</span>
              </div>
              {message.sender === 'You' && (
                <img
                  src={users.find((user) => user.id === message.userId)?.avatar}
                  alt="User  Avatar"
                  className="message-avatar"
                />
              )}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type=" text"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="input-field"
          />
          <button onClick={handleSendMessage} className="send-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="send-icon"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;