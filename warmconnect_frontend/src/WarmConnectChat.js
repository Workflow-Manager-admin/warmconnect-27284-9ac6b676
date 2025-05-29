import React, { useState, useRef, useEffect } from "react";
import "./App.css";

/**
 * PUBLIC_INTERFACE
 * Main WarmConnectChat component.
 * - Message state is an array of { sender: "user"|"bot", text: string, timestamp: Date }
 * - User can type and send messages.
 * - Each user message receives a warm, instant simulated bot reply after a short delay.
 * - UI scrolls smoothly to latest message on send/receive.
 */
function WarmConnectChat({ accentColor = "var(--kavia-orange)", backgroundColor = "var(--kavia-dark)" }) {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi there! I'm WarmConnect. How can I brighten your day today?",
      timestamp: new Date()
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const pendingBotReply = useRef(null);

  // Warm, polite response pool for the bot
  const warmReplies = [
    "Thank you for reaching out! 😊 How can I assist you further?",
    "That's wonderful to hear! Let me know if there's anything you need.",
    "I'm here to help! Feel free to ask me anything.",
    "You're doing great! Is there something you'd like to talk about?",
    "Happy to chat with you! How can I be of service?",
    "It’s always nice chatting with you! Is there anything on your mind today?",
    "If you have a question or just want to chat, I’m here for you!",
    "Remember, you’re never alone here—how can I help?"
  ];

  // Scroll to newest message after render
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Cleanup pending bot response on unmount
  useEffect(() => {
    return () => {
      if (pendingBotReply.current) clearTimeout(pendingBotReply.current);
    };
  }, []);

  // PUBLIC_INTERFACE
  const handleInputChange = (e) => setInput(e.target.value);

  // PUBLIC_INTERFACE
  const handleSend = (e) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    const msgObj = {
      sender: "user",
      text: trimmed,
      timestamp: new Date()
    };
    setMessages((msgs) => [...msgs, msgObj]);
    setInput("");

    // Prepare bot reply after a natural, short delay
    if (pendingBotReply.current) clearTimeout(pendingBotReply.current);
    pendingBotReply.current = setTimeout(() => {
      const botText = warmReplies[Math.floor(Math.random() * warmReplies.length)];
      setMessages((msgsNow) => [
        ...msgsNow,
        {
          sender: "bot",
          text: botText,
          timestamp: new Date()
        }
      ]);
      pendingBotReply.current = null;
    }, 500 + Math.floor(Math.random() * 500)); // 500-1000ms
  };

  // Styling tokens using CSS variables & inline for prop-driven theming (can be extended)
  const themeVars = {
    "--accent-color": accentColor,
    "--chat-bg": backgroundColor
  };

  // PUBLIC_INTERFACE
  return (
    <div
      className="warmconnect-chat-container"
      style={{
        background: "var(--kavia-dark)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "stretch",
        fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        ...themeVars,
      }}
      tabIndex={-1}
      aria-label="WarmConnect Chat window"
    >
      <div className="chat-main-box">
        <header className="chat-header" style={{
          background: "var(--kavia-dark)",
          borderBottom: "1.5px solid var(--border-color)",
          padding: "18px 0px 12px 0px",
          textAlign: "center",
        }}>
          <span className="logo-symbol" style={{ color: "var(--kavia-orange)", fontWeight: 600, marginRight: 8, fontSize: "1.5rem" }}>*</span>
          <span style={{ fontWeight: 500, fontSize: "1.13rem" }}>WarmConnect Chat</span>
        </header>
        <div
          className="chat-messages"
          role="log"
          aria-live="polite"
          tabIndex={0}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-bubble ${msg.sender === "user" ? "chat-bubble-user" : "chat-bubble-bot"}`}
              aria-label={msg.sender === "user" ? "You said" : "Bot replied"}
              tabIndex={0}
            >
              <span>{msg.text}</span>
              <div
                className="chat-time"
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.77rem",
                  marginTop: 4,
                  textAlign: msg.sender === "user" ? "right" : "left",
                  opacity: 0.85,
                  fontWeight: 400,
                  letterSpacing: "0.01em"
                }}
                aria-hidden="true"
              >
                {msg.timestamp instanceof Date
                  ? msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* Chat input area */}
        <form
          className="chat-input-area"
          onSubmit={handleSend}
          role="search" // for accessibility, allows "enter to send"
        >
          <input
            type="text"
            className="chat-input"
            placeholder="Type your message…"
            aria-label="Type your message"
            value={input}
            onChange={handleInputChange}
            autoFocus
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                handleSend(e);
              }
            }}
            style={{ color: "var(--text-color)" }}
          />
          <button
            type="submit"
            className="btn chat-send-btn"
            style={{ backgroundColor: "var(--kavia-orange)", marginLeft: 8 }}
            aria-label="Send message"
            disabled={input.trim() === ""}
            tabIndex={0}
          >
            Send
          </button>
        </form>
      </div>
      {/* Inline style for flexibility, could be moved to CSS file */}
      <style>
        {`
        .chat-main-box {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: stretch;
          align-items: stretch;
          background: var(--kavia-dark);
          max-width: 460px;
          width: 100vw;
          min-height: 540px;
          box-shadow: 0 8px 32px 0 rgba(0,0,0,0.25);
          border-radius: 18px;
          margin: 40px 8px 24px 8px;
          position: relative;
        }
        @media (max-width: 520px) {
          .chat-main-box {
            border-radius: 0;
            min-height: 100vh;
            margin: 0;
            box-shadow: none;
            max-width: 100vw;
          }
        }
        .chat-header {
          position: relative;
          z-index: 10;
          border-radius: 18px 18px 0 0;
        }
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 26px 12px 14px 12px;
          background: var(--kavia-dark);
          display: flex;
          flex-direction: column;
          gap: 14px;
          scroll-behavior: smooth;
        }
        .chat-bubble {
          max-width: 75%;
          word-break: break-word;
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 1.08rem;
          line-height: 1.5;
          box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10);
          border: 1.5px solid var(--border-color);
          margin-bottom: 0px;
          background: var(--kavia-dark);
          color: var(--text-color);
          transition: background 0.2s, color 0.2s;
          outline: none;
        }
        .chat-bubble-bot {
          align-self: flex-start;
          background: #222426;
          color: var(--text-color);
          border: 1.5px solid var(--kavia-orange);
          border-bottom-left-radius: 5px;
        }
        .chat-bubble-user {
          align-self: flex-end;
          background: var(--kavia-orange);
          color: white;
          border: 1.5px solid var(--kavia-orange);
          border-bottom-right-radius: 5px;
        }
        .chat-input-area {
          display: flex;
          align-items: center;
          padding: 14px 14px 14px 14px;
          border-top: 1.5px solid var(--border-color);
          background: var(--kavia-dark);
          border-radius: 0 0 18px 18px;
          position: sticky;
          bottom: 0;
          left: 0;
          z-index: 10;
        }
        @media (max-width: 520px) {
          .chat-input-area {
            border-radius: 0;
          }
        }
        .chat-input {
          flex: 1;
          padding: 13px 16px;
          font-size: 1.09rem;
          border: 1.5px solid var(--border-color);
          border-radius: 8px;
          outline: none;
          background: #232323;
          color: var(--text-color);
          transition: border-color 0.2s;
        }
        .chat-input:focus {
          border-color: var(--kavia-orange);
        }
        .chat-send-btn {
          min-height: 39px;
          min-width: 62px;
          font-weight: 500;
          font-size: 1.09rem;
        }
        .chat-send-btn:disabled {
          background: #8882;
          color: #eee;
          cursor: not-allowed;
        }
        `}
      </style>
    </div>
  );
}

export default WarmConnectChat;
