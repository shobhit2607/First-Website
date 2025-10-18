import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load cart items when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCartItems();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated]);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/cart');
      setCartItems(response.data);
    } catch (error) {
      console.error('Failed to load cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      return { success: false, message: 'Please login to add items to cart' };
    }

    try {
      await axios.post('http://localhost:8000/api/cart', {
        product_id: productId,
        quantity
      });
      
      // Reload cart items
      await loadCartItems();
      return { success: true, message: 'Item added to cart' };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add item to cart' 
      };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      await axios.put(`http://localhost:8000/api/cart/${itemId}`, {
        quantity
      });
      
      // Reload cart items
      await loadCartItems();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update cart item' 
      };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8000/api/cart/${itemId}`);
      
      // Reload cart items
      await loadCartItems();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to remove item from cart' 
      };
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
    loadCartItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};