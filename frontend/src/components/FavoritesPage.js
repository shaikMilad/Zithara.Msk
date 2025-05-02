import React from 'react';
import './HomePage.css';

const FavoritesPage = ({ favorites, toggleFavorite, goBack }) => {
  return (
    <div className="chat-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Your Favorites</h2>
        <button onClick={goBack} className="favorite-button">Back to Store</button>
      </div>
      {favorites.length === 0 ? (
        <p>You have no favorite products yet.</p>
      ) : (
        <div className="products-grid">
          {favorites.map((product, index) => (
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
                title="Remove from favorites"
              >
                ★
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
