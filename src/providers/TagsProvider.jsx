import React, { useContext, createContext, useReducer } from "react";

// Define the Context and Initial State
const TagsContext = createContext();
const initialState = {
    userTags: {},
};

export const useTagsContext = () => {
    return useContext(TagsContext);
};

// Define a Reducer
const reducer = (state, action) => {
    switch (action.type) {
      case "SET_USER_TAGS":
        return {
          ...state,
          userTags: { ...state.userTags, ...action.userTags },
        };
      case "CLEAR_USER_TAGS":
        return {
          ...state,
          userTags: {},
        };
      default:
        return state;
    }
  };
  
// Create a Provider Component
export const TagsProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
  
    const tagsContext = {
      userTags: state.userTags,
      setUserTags: (userTags) => dispatch({ type: "SET_USER_TAGS", userTags }),
      clearUserTags: () => dispatch({ type: "CLEAR_USER_TAGS" }),
    };
  
    return (
      <TagsContext.Provider value={tagsContext}>
        {children}
      </TagsContext.Provider>
    );
};
