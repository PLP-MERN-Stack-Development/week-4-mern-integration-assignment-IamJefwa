import React, { useState, useRef, useEffect } from 'react';
import '../css/styles.css'; // You'll need to convert the CSS from the original

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [initials, setInitials] = useState("Mutai Hillary");
  const messagesRef = useRef(null);

  // Enable/disable send button based on input
  const isSendDisabled = inputMessage.trim() === '';

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    // Add logic to update CSS variables or classes
  };
  

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  const getMarkdownResponse = async (inputMessage) => {
    try {
        const res = await fetch('http://localhost:8000/api/query/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: inputMessage })
        });

        if (!res.ok) {
            throw new Error('Failed to fetch response');
        }

        const data = await res.json();
        return data.response;
    } catch (error) {
        console.error('Error fetching markdown response:', error);
        return 'Error fetching response';
    }
};

const [markdown, setMarkdown] = useState('');

const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    // Add user message
    const newMessages = [...messages, { text: inputMessage, sender: 'user' }];
    setMessages(newMessages);
    setInputMessage('');

    try {
        // Await the markdown response before updating messages
        const response = await getMarkdownResponse(inputMessage);
        setMarkdown(response);

        // Update messages with assistant response
        setMessages(prevMessages => [
            ...prevMessages,
            { text: response, sender: 'assistant' }
        ]);
    } catch (error) {
        console.error('Error handling message:', error);
    }
};


  // Handle input changes
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isSendDisabled) {
      handleSendMessage();
    }
  };

  // Clear conversation
  const clearConversation = () => {
    setMessages([]);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={`app-container ${isDarkTheme ? 'dark-theme' : ''} ${isFullScreen ? 'full-screen' : ''}`}>
      <div className="bg"></div>
      <div className="chat">
        {/* Chat Title */}
        <div className="chat-title">
          <figure className="avatar">
            <img src="/images/PLP-logo.jpg" alt="Avatar" />
          </figure>
          <p className="myName">PLP-Virtual Assistant</p>
          <span>{initials}</span>
        </div>

        {/* Status Bar */}
        <div className="statusBar">
          <span className="new-chat" title="New chat" onClick={clearConversation}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
              stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </span>
          <span className="status"></span>
          <span className="clear-convo" title="Clear conversation" onClick={clearConversation}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
              stroke="currentColor" className="svg-boxes">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
              stroke="currentColor" className={`close-svg1 ${true ? 'hidden' : ''}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </span>
        </div>

        {/* Settings Modal */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="flex" style={{ position: "sticky" }}>
                <span className="flex">
                  <p id="name">name</p>
                  <hr />
                  <p>You are logged in as: User</p>
                  <hr />
                  <p><a href="#" style={{ color: '#fff' }}> Logout </a></p>
                </span>
                <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
              </div>
              <hr />
              <h3>UI Customization:</h3>
              <p>(DISCLAIMER!!: Some of these features are still under development)</p>
              <div className="modal-content">
                <p className="sp">
                  <span>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={!showSuggestions}
                        onChange={() => setShowSuggestions(!showSuggestions)} 
                      />
                      <span className="slider"></span>
                    </label>
                  </span>
                </p>
                <p>Hide Suggestions</p>
                <p className="sp">
                  <span>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={isDarkTheme}
                        onChange={toggleTheme} 
                      />
                      <span className="slider"></span>
                    </label>
                  </span>
                </p>
                <p>Dark Theme</p>
                <p className="sp">
                  <span>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={isFullScreen}
                        onChange={() => setIsFullScreen(!isFullScreen)} 
                      />
                      <span className="slider"></span>
                    </label>
                  </span>
                </p>
                <p>Full Screen.</p>
              </div>
              <h3>User data:</h3>
              <div className="modal-content">
                <p className="sp">
                  <span>
                    <label className="switch">
                      <input type="checkbox" />
                      <span className="slider"></span>
                    </label>
                  </span>
                </p>
                <p>Keep Conversation History</p>
                <h5>
                  Note: <br />
                  Your conversations may be used to improve the efficiency of our
                  model. <br />
                  Please do not share sensitive information!
                </h5>
              </div>
              <h3>Contact:</h3>
              <div className="modal-content">
                <h3>Contact the institution.</h3>
                <button>Email</button>
                <button>Socials</button>
                <button>Help center.</button>
                <h3>Contact the Developer.</h3>
                <button>Email.</button>
                <button>Socials.</button>
              </div>
              <div className="modal-content">
                <p className="sp">
                  <span>
                    <label className="switch">
                      <input type="checkbox" />
                      <span className="slider"></span>
                    </label>
                  </span>
                </p>
                <p>Disable</p>
                <button>Leave Comment.</button>
                <button>Find help.</button>
                <button>Exit</button>
                <button className="fqa">?</button>
              </div>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="messages" ref={messagesRef}>
          {messages.length === 0 ? (
            <div className="default-text">
              <h1>Your Journey To Greatness Begins Today!</h1>
              <img className="image" src="/images/logo.webp" alt="N/A" />
              <p>
                Start a conversation and explore the power of AI.<br />
                Your dialog will appear here.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div 
                key={index} 
                className={`message ${msg.sender === 'user' ? 'message-personal' : ''}`}
              >
                {msg.text}
              </div>
            ))
          )}
        </div>

        {/* Suggestions Area */}
        {showSuggestions && (
          <div className="suggestions">
            {/* Suggestions would be dynamically generated */}
          </div>
        )}

        {/* Message Input Area */}
        <div className="message-box">
          <div className="menu-container">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="1.5"
              stroke="currentColor" 
              className="dots"
              onClick={() => document.querySelector('.dropdown-content').classList.toggle('show')}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round"
                d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" 
              />
            </svg>
            
            {/* Dropdown Content */}
            <div className="dropdown-content">
              <button className="close1" onClick={() => document.querySelector('.dropdown-content').classList.remove('show')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                  stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
              <button onClick={toggleTheme}>
                <span title="Theme">
                  {isDarkTheme ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                      stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                      stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                    </svg>
                  )}
                </span>
              </button>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                  stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                </svg>
              </button>
              <button onClick={scrollToBottom}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                  stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                </svg>
              </button>
            </div>
          </div>
          
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="message-input"
            placeholder="Type your message..."
            autoComplete="off"
          />
          
          <button 
            className="message-submit" 
            onClick={handleSendMessage}
            disabled={isSendDisabled}
          >
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd"
                  d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;