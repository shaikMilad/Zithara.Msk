import React, { useState, useEffect, useRef } from 'react';
import NavBar from './NavBar';
import FavoritesPage from './FavoritesPage';
import './HomePage.css';

const HomePage = ({ onLogout }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Welcome to our store! Feel free to ask me about our products or any assistance you need.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [view, setView] = useState('chat'); // 'chat' or 'favorites'
  const messagesEndRef = useRef(null);
  const storeSectionRef = useRef(null);

  useEffect(() => {
    // Fetch products from JSON file on component mount
    fetch('/store/products.json')
      .then((res) => res.json())
      .then((data) => setProducts(data.products))
      .catch((err) => console.error('Failed to load products:', err));
  }, []);

  useEffect(() => {
    // Scroll to bottom inside messages container when messages change
    if (messagesEndRef.current && view === 'chat') {
      // Scroll the messages container, not the whole page
      const container = messagesEndRef.current.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages, view]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const apiUrl = 'https://zithara-msk.onrender.com';
      const response = await fetch(`${apiUrl}/api/chat`, {
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
    onLogout();
  };

  const scrollToStore = () => {
    setView('chat');
    if (storeSectionRef.current) {
      storeSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (view === 'favorites') {
    return (
      <>
        <NavBar
          onLogout={logout}
          onStoreClick={scrollToStore}
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
        onStoreClick={scrollToStore}
        onFavoritesClick={() => setView('favorites')}
        favoritesCount={favorites.length}
      />
      <>
        <div className="chatbot-section">
          <h2 className="chatbot-header" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            Product Discovery AI
            <img src="/robot.gif" alt="Robot Gif" style={{ height: '40px', width: '40px' }} />
          </h2>
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
                AI is thinking...
              </div>
            )}
          </div>
          <div className="input-send-container">
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
        </div>

        <div className="store-section" ref={storeSectionRef}>
          <h3 className="store-header">Welcome To Our Store</h3>
          <input
            type="text"
            placeholder="Search products..."
            className="product-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="products-grid">
            {products
              .filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((product, index) => (
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
      </>
    </>
  );
};

export default HomePage;
