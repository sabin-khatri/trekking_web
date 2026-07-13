// src/components/WishlistContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';
import { treks } from '../data/treks';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { addToast } = useToast();

  // SSR-safe lazy initialization of state
  const [wishlist, setWishlist] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('wishlist');
        return saved ? JSON.parse(saved) : [];
      } catch (error) {
        console.error('Failed to parse wishlist from localStorage', error);
        return [];
      }
    }
    return [];
  });

  // Sync state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
      } catch (error) {
        console.error('Failed to save wishlist to localStorage', error);
      }
    }
  }, [wishlist]);

  // Toggle add/remove from wishlist
  const toggleWishlist = useCallback((trekId) => {
    const trek = treks.find((t) => t.id === trekId);
    const trekName = trek ? trek.name : 'Trek';
    const isAlreadySaved = wishlist.includes(trekId);

    if (isAlreadySaved) {
      setWishlist((prev) => prev.filter((id) => id !== trekId));
      addToast(`Removed ${trekName} from wishlist.`, 'info');
    } else {
      setWishlist((prev) => [...prev, trekId]);
      addToast(`Added ${trekName} to wishlist.`, 'success');
    }
  }, [wishlist, addToast]);

  // Check if a trek is in wishlist
  const isInWishlist = useCallback((trekId) => {
    return wishlist.includes(trekId);
  }, [wishlist]);

  // Clear all items in wishlist
  const clearWishlist = useCallback(() => {
    setWishlist([]);
    addToast('Wishlist cleared.', 'info');
  }, [addToast]);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
