import React, { useState, useEffect } from "react";
import { useEmail } from '../context/EmailContext'; // Import the email context

const Chat = () => {
  const { email: userEmail } = useEmail(); // Access the email from context
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState("");
  const [newMessage, setNewMessage] = useState("");

  // Fetch conversations for the current user
  useEffect(() => {
    if (userEmail) { // Ensure email is available before making the request
      fetch(`http://localhost:8080/chat/conversations?email=${userEmail}`)
        .then((response) => response.json())
        .then((data) => setConversations(data))
        .catch((error) => console.error("Error fetching conversations:", error));
    }
  }, [userEmail]);

  const fetchMessages = (conversationId) => {
    setCurrentConversationId(conversationId);
    fetch(`http://localhost:8080/chat/${conversationId}`)
      .then((response) => response.json())
      .then((data) => setMessages(data))
      .catch((error) => console.error("Error fetching messages:", error));
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !currentConversationId) return;

    const messageData = {
      conversation_id: currentConversationId,
      sender: userEmail,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    fetch("http://localhost:8080/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    })
      .then((response) => {
        if (response.ok) {
          setMessages([...messages, messageData]);
          setNewMessage("");
        } else {
          console.error("Failed to send message");
        }
      })
      .catch((error) => console.error("Error sending message:", error));
  };

  return (
    <div className="container mt-4">
      <h2>Chat</h2>
      <div className="row">
        <div className="col-md-4">
          <h4>Conversations</h4>
          <ul className="list-group">
            {conversations.map((conv) => (
              <li
                key={conv._id}
                className={`list-group-item ${
                  conv._id === currentConversationId ? "active" : ""
                }`}
                onClick={() => fetchMessages(conv._id)}
              >
                {conv.users.filter((user) => user !== userEmail).join(", ")}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-8">
          <h4>Messages</h4>
          <div className="chat-box">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message`}>
                <strong>{msg.sender}:</strong> {msg.message} <br />
                <small className="text-muted">{new Date(msg.timestamp).toLocaleString()}</small>
              </div>
            ))}
          </div>
          <div className="d-flex mt-3">
            <input
              type="text"
              className="form-control"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button className="btn btn-primary ml-2" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
