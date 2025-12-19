import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Sender } from './types';
import { fetchWithAuth } from "./store/todoslice";
// import { setTodos } from "./store/todoslice";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "welcome-msg",
      text: "Hello! I can help you manage your tasks. Ask me anything like 'How many todos do I have?' or 'Create a todo for gym tomorrow at 5pm'",
      sender: Sender.BOT,
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const userdata = JSON.parse(localStorage.getItem('user'));
  const dispatch = useDispatch();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) setTimeout(() => inputRef.current.focus(), 100);
  }, [isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  // --- Inline SVG Icons ---
  const MessageCircleIcon = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 12h8M12 8v8"/>
    </svg>
  );

  const XIcon = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );

  const SendIcon = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );

  const BotIcon = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <circle cx="15.5" cy="8.5" r="1.5"/>
      <path d="M8 15c1.5 1 4 1 6 0"/>
    </svg>
  );

  const RefreshCwIcon = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0114.13-3.36L23 10M1 14l4.36 4.36A9 9 0 0020.49 15"/>
    </svg>
  );

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessageText = inputText.trim();
    const userMessage = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: Sender.USER,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const botMessageId = (Date.now() + 1).toString();
      const botMessagePlaceholder = {
        id: botMessageId,
        text: "",
        sender: Sender.BOT,
        timestamp: new Date(),
        isStreaming: true,
      };
      setMessages((prev) => [...prev, botMessagePlaceholder]);

      const response = await fetchWithAuth(`${import.meta.env.VITE_APP_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessageText, userId: userdata?.id }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const botText = data.text || "I couldn't generate a response.";

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId ? { ...msg, text: botText, isStreaming: false } : msg
        )
      );

    //   if (data.todos && Array.isArray(data.todos)) dispatch(setTodos(data.todos));

    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === (Date.now() + 1).toString() ? { ...msg, text: "Sorry, I encountered an error. Please try again.", isStreaming: false } : msg
        )
      );
    } finally { setIsLoading(false); }
  };

  const handleResetChat = () => {
    setMessages([{
      id: Date.now().toString(),
      text: "Conversation reset. How can I help you with your tasks now?",
      sender: Sender.BOT,
      timestamp: new Date(),
    }]);
  };

  return (
    <div className="chat-widget-container">
      <div className={`chat-window ${isOpen ? "open" : "closed"}`}>
        <div className="chat-header">
          <div className="header-left">
            <div className="bot-icon-wrapper">
              <BotIcon className="bot-icon" />
            </div>
            <div>
              <h3 className="chat-title">Todo Assistant</h3>
              <p className="chat-subtitle">Powered by Gemini AI</p>
            </div>
          </div>
          <div className="header-right">
            <button onClick={handleResetChat} disabled={isLoading} className="header-btn">
              <RefreshCwIcon className="icon" />
            </button>
            <button onClick={toggleChat} className="header-btn">
              <XIcon className="icon" />
            </button>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.sender === Sender.USER ? "user" : "bot"}`}>
              <div className="message-bubble">
                {msg.text}
                {msg.isStreaming && (
                  <span className="typing-indicator">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </span>
                )}
              </div>
              <span className="message-time">
                {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <form onSubmit={handleSendMessage} className="chat-form">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <button type="submit" disabled={!inputText.trim() || isLoading} className="send-btn">
              <SendIcon className="icon" />
            </button>
          </form>
          <div className="chat-info">AI can make mistakes. Check important info.</div>
        </div>
      </div>

      <button className={`chat-toggle-button ${isOpen ? "open" : ""}`} onClick={toggleChat}>
        {isOpen ? <XIcon className="toggle-icon" /> : <MessageCircleIcon className="toggle-icon" />}
      </button>
    </div>
  );
};

export default ChatWidget;
