import React, { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]); // State to store cart items

  // Function to calculate the total cost of the cart
  const calculateTotalCost = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        cart, // Provide cart to the rest of the app
        setCart, // Function to update cart
        calculateTotalCost, // Provide total cost calculation function
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
