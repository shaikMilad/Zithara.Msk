import React, { useState } from 'react';
import './EntryPage.css';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const EntryPage = ({ onAuthSuccess }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const handleBack = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const switchToRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const switchToLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  return (
    <div className="entry-page-container">
      <div className="entry-page-left">
        <img
          src="https://www.creatopy.com/blog/wp-content/uploads/2018/05/animations-e-commerce.png"
          alt="Entry Page Visual"
          className="entry-page-image"
        />
      </div>
      <div className="entry-page-right">
        {!showLogin && !showRegister && (
          <>
            <h1>ShopEase AI</h1>
            <button onClick={handleLoginClick} className="entry-page-button">
              Login
            </button>
            <button onClick={handleRegisterClick} className="entry-page-button">
              Register
            </button>
          </>
        )}
        {showLogin && (
          <>
            <button onClick={handleBack} className="back-button">
              &larr; Back
            </button>
            <LoginForm onLogin={onAuthSuccess} onSwitchToRegister={switchToRegister} />
          </>
        )}
        {showRegister && (
          <>
            <button onClick={handleBack} className="back-button">
              &larr; Back
            </button>
            <RegisterForm onRegister={onAuthSuccess} onSwitchToLogin={switchToLogin} />
          </>
        )}
      </div>
    </div>
  );
};

export default EntryPage;
