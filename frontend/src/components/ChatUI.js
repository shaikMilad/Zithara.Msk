import React, { useState, useEffect, useRef } from 'react';
import './ChatUI.css';
import FavoritesPage from './FavoritesPage';
import NavBar from './NavBar';

const ChatUI = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Welcome to our store! Feel free to ask me about our products or any assistance you need.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [view, setView] = useState('chat'); // 'chat' or 'favorites'
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch products from JSON file on component mount
    fetch('/store/products.json')
      .then((res) => res.json())
      .then((data) => setProducts(data.products))
      .catch((err) => console.error('Failed to load products:', err));
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current && view === 'chat') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, view]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, products }),
      });
      const data = await response.json();
      const botMessage = { sender: 'bot', text: data.response || 'No response' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { sender: 'bot', text: 'Error communicating with server.' };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      const isFav = prev.find((p) => p.name === product.name);
      if (isFav) {
        return prev.filter((p) => p.name !== product.name);
      } else {
        return [...prev, product];
      }
    });
  };

  const isFavorite = (product) => {
    return favorites.some((p) => p.name === product.name);
  };

  const logout = () => {
    // Implement logout logic here, e.g., clear tokens, redirect, etc.
    alert('Logout clicked');
  };

  if (view === 'favorites') {
    return (
      <>
        <NavBar
          onLogout={logout}
          onStoreClick={() => setView('chat')}
          onFavoritesClick={() => setView('favorites')}
          favoritesCount={favorites.length}
        />
        <FavoritesPage
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          goBack={() => setView('chat')}
        />
      </>
    );
  }

  return (
    <>
      <NavBar
        onLogout={logout}
        onStoreClick={() => setView('chat')}
        onFavoritesClick={() => setView('favorites')}
        favoritesCount={favorites.length}
      />
      <div className="chat-container">
        {/* Chatbot section */}
        <div className="chatbot-section">
          <h2 className="chatbot-header">Product Suggestion Chat</h2>
          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={index} className={msg.sender === 'user' ? 'message-user' : 'message-bot'}>
                <span className={msg.sender === 'user' ? 'message-text-user' : 'message-text-bot'}>
                  {msg.text}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
            {isLoading && (
              <div className="typing-indicator">
                Bot is typing...
              </div>
            )}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="chat-input"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            className="send-button"
            disabled={isLoading}
          >
            Send
          </button>
        </div>

        {/* Store section */}
        <div className="store-section">
          <h3 className="store-header">Our Products</h3>
          <div className="products-grid">
            {products.map((product, index) => (
              <div key={index} className="product-card">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <h4 className="product-name">{product.name}</h4>
                <p className="product-price">{product.price}</p>
                <p className="product-category">{product.category}</p>
                <p className="product-description">{product.description}</p>
                <button
                  className="product-favorite-button"
                  onClick={() => toggleFavorite(product)}
                  title={isFavorite(product) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {isFavorite(product) ? '★' : '☆'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatUI;
