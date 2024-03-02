import React, { createContext, useReducer, useContext } from 'react';

const LocalLoginStatusContext = createContext();

export const useLocalLoginStatusContext = () => useContext(LocalLoginStatusContext);

const initialState = {
  isPopupVisible: false,
  localLogin: false,
  isLoginPageVisible: false
};

const loginReducer = (state, action) => {
  switch (action.type) {
    case 'SET_POPUP_VISIBILITY':
      return { ...state, isPopupVisible: action.payload };
    case 'SET_LOGIN_PAGE_VISIBILITY':
      return { ...state, isLoginPageVisible: action.payload };
    case 'SET_LOCAL_LOGIN':
      return { ...state, localLogin: action.payload };
    default:
      return state;
  }
};

export const LocalLoginStatusContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(loginReducer, initialState);

  const setPopupVisibility = (isVisible) => {
    dispatch({ type: 'SET_POPUP_VISIBILITY', payload: isVisible });
  };

  const setLoginPageVisibility = (isVisible) => {
    dispatch({ type: 'SET_LOGIN_PAGE_VISIBILITY', payload: isVisible });
  };

  const setLocalLogin = (value) => {
    dispatch({ type: 'SET_LOCAL_LOGIN', payload: value });
  };

  return (
    <LocalLoginStatusContext.Provider 
      value={{
        isPopupVisible: state.isPopupVisible,
        localLogin: state.localLogin,
        isLoginPageVisible: state.isLoginPageVisible,
        setPopupVisibility,
        setLoginPageVisibility,
        setLocalLogin
      }}
    >
      {children}
    </LocalLoginStatusContext.Provider>
  );
};
