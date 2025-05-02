import React, { useState, useEffect } from 'react';
import EntryPage from './components/EntryPage';
import HomePage from './components/HomePage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        <HomePage onLogout={handleLogout} />
      ) : (
        <EntryPage onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

export default App;
