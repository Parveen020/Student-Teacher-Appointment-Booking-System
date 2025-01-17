import React, { useEffect, useContext, useState } from "react";
import { TeacherContext } from "../../context/teacherAuthContext";
import axios from "axios";
import "./ViewMessages.css";

const ViewMessages = () => {
  const { url, data, token, email } = useContext(TeacherContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract messages from the context data and set them
  useEffect(() => {
    console.log("ViewMessage Data:", data);

    if (data && data.messages) {
      setMessages(data.messages); // Only set messages if data exists
    } else {
      setError("No messages available.");
    }
    setLoading(false);
  }, [data]);

  if (loading) {
    return (
      <div className="chat-container">
        <div className="chat-loading">Loading messages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-container">
        <div className="chat-error">{error}</div>
      </div>
    );
  }

  // Function to determine message status class
  const getMessageStatusClass = (status) => {
    switch (status) {
      case "unread":
        return "message-unread";
      case "read":
        return "message-read";
      case "archived":
        return "message-archived";
      default:
        return "";
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        <div className="chat-header">
          <h3>Messages</h3>
          <span className="message-count">
            {messages.length} {messages.length === 1 ? "message" : "messages"}
          </span>
        </div>

        <div className="chat-body">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-container ${getMessageStatusClass(
                  msg.status
                )}`}
              >
                <div className="message">
                  <div className="message-content">{msg.content}</div>
                  <div className="message-details">
                    <div className="sender-info">
                      <span className="sender-name">{msg.senderName}</span>
                      {msg.senderRollNo && (
                        <span className="sender-roll">
                          ({msg.senderRollNo})
                        </span>
                      )}
                    </div>
                    <div className="message-metadata">
                      <span className="timestamp">{msg.timestamp}</span>
                      {msg.status === "unread" && (
                        <span className="unread-indicator">New</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-messages">
              <p>No messages available</p>
              <span className="no-messages-sub">
                When students send you messages, they will appear here
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewMessages;
