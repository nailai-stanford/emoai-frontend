import React, { useContext, createContext, useReducer, useEffect } from "react";

const AuthenticationContext = createContext();

const initialState = {
  isLoading: true,
  isLoggedIn: false,
  userInfo: null,
};

export const useAuthenticationContext = () => {
  return useContext(AuthenticationContext);
};

const reducer = (prevState, action) => {
  switch (action.type) {
    case "SIGN_IN":
      return {
        ...prevState,
        isLoggedIn: true,
        userInfo: action.userInfo,
      };
    case "SIGN_OUT":
      return {
        ...initialState,
      };
    default:
      throw Error();
  }
};

export const AuthenticationProvider = ({ children }) => {
  // https://reactnavigation.org/docs/auth-flow/

  const [state, dispatch] = useReducer(reducer, initialState);

  const authContext = {
    userInfo: state.userInfo,
    isLoggedIn: state.isLoggedIn,
    setUserInfo: (userInfo) => dispatch({ type: "SIGN_IN", userInfo }),
    signout: () => dispatch({ type: "SIGN_OUT" }),
  };

  return (
    <AuthenticationContext.Provider value={authContext}>
      {children}
    </AuthenticationContext.Provider>
  );
};
