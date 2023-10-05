import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useUser } from "../UserContext"
import axios from 'axios'

interface IProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image_url: string;
}

interface ICartItem {
  product: IProduct;
  quantity: number;
}

interface ICartContext {
  cart: ICartItem[];
  addToCart: (product: IProduct, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}
interface ICartProviderProps {
  children: ReactNode;
}

export const CartContext = createContext<ICartContext | undefined>(undefined);

export const CartProvider: React.FC<ICartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<ICartItem[]>([]);
  const { userId, isLoggedIn } = useUser();

  const addToCart = async (product: IProduct, quantity: number = 1) => {
    try {

      if (!isLoggedIn) {
        alert("You need to be logged in to add items to the cart!");
        return;
      }

  

      const payload = { userId, productId: product.id, quantity };
      

      console.log("Sending payload:", payload);
      const response = await axios.post('http://localhost:5000/api/cart/add', payload);

      
      if (response.status === 201) {

        setCart((prevCart) => {
          const existingItemIndex = prevCart.findIndex(p => p.product.id === product.id);
          if(existingItemIndex > -1) {
            const newCart = [...prevCart];
            newCart[existingItemIndex].quantity += quantity;
            return newCart;
          }
          return [...prevCart, { product, quantity }];
        });
      } else {
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };


  const removeFromCart = async (productId: number) => {
    try {
      if (!isLoggedIn || !userId) {
        alert("You need to be logged in to remove items from the cart!");
        return;
      }
      
  
      const response = await fetch(`/api/remove/${productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId })
      });
  
      if (response.ok) {
        setCart((prevCart) => prevCart.filter(item => item.product.id !== productId));
      } else {
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);

    }
  };

  const clearCart = () => {
    setCart([]);
  };
  
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};