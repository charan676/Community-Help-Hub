import { useState, useRef, useEffect } from 'react';
import { chatbot } from '../../services/api';

const renderMessageText = (text) => {
  if (!text) return null;
  
  const lines = text.split('\n');
  const renderedElements = [];
  let currentList = [];

  const flushList = (key) => {
    if (currentList.length > 0) {
      renderedElements.push(
        <ul key={`list-${key}`} style={{ margin: '8px 0', paddingLeft: '20px', listStyleType: 'disc' }}>
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ');

    if (isBullet) {
      const cleanLine = trimmed.replace(/^[-*]\s+/, '');
      const parts = cleanLine.split('**');
      const content = parts.map((part, pIdx) => {
        if (pIdx % 2 === 1) {
          return <strong key={pIdx} style={{ fontWeight: 700, color: 'inherit' }}>{part}</strong>;
        }
        return part;
      });
      currentList.push(
        <li key={`li-${index}`} style={{ marginBottom: '4px', lineHeight: '1.4' }}>
          {content}
        </li>
      );
    } else {
      flushList(index);
      if (trimmed === '') {
        renderedElements.push(<div key={`empty-${index}`} style={{ height: '8px' }} />);
      } else {
        const parts = line.split('**');
        const content = parts.map((part, pIdx) => {
          if (pIdx % 2 === 1) {
            return <strong key={pIdx} style={{ fontWeight: 700, color: 'inherit' }}>{part}</strong>;
          }
          return part;
        });
        renderedElements.push(
          <div key={`p-${index}`} style={{ margin: '4px 0', lineHeight: '1.4' }}>
            {content}
          </div>
        );
      }
    }
  });

  flushList('end');
  return renderedElements;
};

export const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const language = localStorage.getItem('language') || 'en';

  useEffect(() => {
    // Seed initial message
    const welcomeText = language === 'te'
      ? "నమస్కారం! నేను మీ హెల్ప్ హబ్ సహాయకుడిని. నేను మీకు ఎలా సహాయం చేయగలను?"
      : "Hello! I am your Help Hub AI assistant. How can I help you today?";
    
    const timer = setTimeout(() => {
      setMessages((prev) => {
        if (prev.length > 0 && prev[0].id === 'welcome' && prev[0].text === welcomeText) {
          return prev;
        }
        const welcomeMsg = { id: 'welcome', text: welcomeText, sender: 'bot' };
        if (prev.length > 0 && prev[0].id === 'welcome') {
          return [welcomeMsg, ...prev.slice(1)];
        }
        return [welcomeMsg, ...prev];
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      text: inputText,
      sender: 'user'
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const location = localStorage.getItem('selectedDistrict') || '';
      const response = await chatbot.ask(userMessage.text, location, language);
      
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          text: response.data.reply,
          sender: 'bot'
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error_${Date.now()}`,
          text: language === 'te' ? 'సమస్య ఎదురైంది. దయచేసి మళ్ళీ ప్రయత్నించండి.' : 'Error getting response. Please try again.',
          sender: 'bot'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        className="chatbot-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chatbot"
      >
        💬
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h4>🤖 AI Assistant</h4>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              ✕
            </button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
                <div>{renderMessageText(msg.text)}</div>
              </div>
            ))}
            
            {loading && (
              <div className="chat-bubble bot">
                <span className="typing-dots">
                  <span>.</span><span>.</span><span>.</span>
                </span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input-area" onSubmit={handleSendMessage}>
            <input 
              type="text" 
              placeholder={language === 'te' ? "ఇక్కడ టైప్ చేయండి..." : "Ask a question..."} 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ padding: '8px 16px' }}
              disabled={loading}
            >
              ➔
            </button>
          </form>
        </div>
      )}
      
      <style>{`
        .typing-dots span {
          animation: blink 1.4s infinite both;
          font-weight: bold;
          font-size: 1.2rem;
        }
        .typing-dots span:nth-child(2) { animation-delay: .2s; }
        .typing-dots span:nth-child(3) { animation-delay: .4s; }

        @keyframes blink {
          0% { opacity: .2; }
          20% { opacity: 1; }
          100% { opacity: .2; }
        }
      `}</style>
    </>
  );
};

export default ChatbotWidget;
