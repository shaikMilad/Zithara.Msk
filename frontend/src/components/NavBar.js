import React from 'react';

const NavBar = ({ onLogout, onStoreClick, onFavoritesClick, favoritesCount }) => {
  return (
    <nav style={styles.nav}>
      <div style={styles.title}>ShopEase AI</div>
      <button style={styles.button} onClick={onStoreClick}>Store</button>
      <button style={styles.button} onClick={onFavoritesClick}>
        Favorites {favoritesCount > 0 ? `(${favoritesCount})` : ''}
      </button>
      <button style={styles.button} onClick={onLogout}>Logout</button>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: 'black',
    fontFamily: "'Poppins', sans-serif",
  },
  title: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    marginRight: 'auto',
    fontFamily: "'Poppins', sans-serif",
  },
  button: {
    marginLeft: 15,
    padding: '8px 12px',
    fontSize: '16px',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: '600',
    color: 'Black',
    backgroundColor: 'Khaki',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
};

export default NavBar;
