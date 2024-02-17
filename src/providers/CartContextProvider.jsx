import React, { useContext, createContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = {
  cart: null,
};

const ActionTypes = {
  SET_CART: 'SET_CART',
  CLEAR_CART: 'CLEAR_CART',
};

const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_CART:
      return { ...state, cart: action.payload };
    case ActionTypes.CLEAR_CART:
      return { ...initialState };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const useCartContext = () => {
  return useContext(CartContext);
};

export const CartContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setCart = cart => {
    dispatch({ type: ActionTypes.SET_CART, payload: cart });
  };

  const clearCart = () => {
    dispatch({ type: ActionTypes.CLEAR_CART });
  };

  const cartContext = {
    cart: state.cart,
    setCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {children}
    </CartContext.Provider>
  );
};
