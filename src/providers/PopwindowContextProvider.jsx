import React, { useContext, createContext, useReducer } from 'react';

const PopwindowContext = createContext();

const initialState = {
  display: false,
};

const ActionTypes = {
  DISPLAY: 'DISPLAY',
  HIDE: 'HIDE',
};

const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.DISPLAY:
      return { ...state, display: true};
    case ActionTypes.HIDE:
      return { ...initialState };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const usePopwindowContext = () => {
  return useContext(PopwindowContext);
};

export const PopwindowContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const displayLoginPopwindow = () => {
    dispatch({ type: ActionTypes.DISPLAY});
  };

  const hideLoginPopwindow = () => {
    dispatch({ type: ActionTypes.HIDE });
  };

  const popwindowContext = {
    display,
    displayLoginPopwindow, 
    hideLoginPopwindow
  };

  return (
    <PopwindowContext.Provider value={popwindowContext}>
      {children}
    </PopwindowContext.Provider>
  );
};