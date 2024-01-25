import React, { useContext, createContext, useReducer } from "react";

// 1. Define the Context and Initial State
const DesignContext = createContext();
const initialState = {
    designIds: [],
};

export const useDesignContext = () => {
    return useContext(DesignContext);
};

// 3. Define a Reducer
const reducer = (state, action) => {
    switch (action.type) {
      case "ADD_DESIGN_IDS":
        return {
          ...state,
          designIds: [...state.designIds, ...action.designIds],
        };
      case "CLEAR_DESIGN_IDS":
        return {
          ...state,
          designIds: [],
        };
      default:
        return state;
    }
  };
  
  // 4. Create a Provider Component
  export const DesignProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
  
    const designContext = {
      designIds: state.designIds,
      addDesignIds: (designIds) => dispatch({ type: "ADD_DESIGN_IDS", designIds }),
      clearDesignIds: () => dispatch({ type: "CLEAR_DESIGN_IDS" }),
    };
  
    return (
      <DesignContext.Provider value={designContext}>
        {children}
      </DesignContext.Provider>
    );
  };