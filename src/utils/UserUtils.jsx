import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { APIs, getHeader } from "./API";
import { SecureStoreKeys, handleError, handleResponse } from "./Common";
import { Config } from "./Config";

export const getUserInfoFromStore = async () => {
  let userInfo = await AsyncStorage.getItem(SecureStoreKeys.UserInfo);
  if (userInfo) {
    userInfo = JSON.parse(userInfo);
    console.log("getUserInfoFromStore", userInfo);
    return userInfo;
  }
  return null;
};

export const onPressLogout = async () => {
  await AsyncStorage.removeItem(SecureStoreKeys.UserInfo);
};


export const onPressSignIn = async () => {
  try {
    // First, configure the Google Signin method
    GoogleSignin.configure({
      androidClientId: Config.ANDROID_CLIENT_ID,
      iosClientId: Config.IOS_CLIENT_ID,
      // Add other configuration parameters if needed
    });

    // Check for Play services, necessary on Android
    await GoogleSignin.hasPlayServices();

    // Sign in and get the user data from Google
    const userInfo = await GoogleSignin.signIn();

    // Structure the payload you need to send to your backend
    const payload = {
      idToken: userInfo.idToken,
      email: userInfo.user.email,
      source: "google",
      sourceId: userInfo.user.id,
      firstName: userInfo.user.givenName,
      lastName: userInfo.user.familyName,
    };

    // Send the user info to your backend for verification and further processing
    const response = await axios.post(APIs.USER_LOGIN, payload, {
      headers: getHeader(userInfo.idToken),
    });

    // Handle the response from your backend
    handleResponse(response, userInfo);

    // Store the user information in AsyncStorage for later use
    await setUserInfoInStore(userInfo);

    // Return the user data and response
    return { userInfo, response };
  } catch (error) {
    // Handle any errors, such as failed Google login or backend issues
    handleError(error);

    // You could re-throw the error or return it to be handled where the function is called
    throw error;
  }
};


export const setUserInfoInStore = async (UserInfo) => {
  await AsyncStorage.setItem(
    SecureStoreKeys.UserInfo,
    JSON.stringify(UserInfo)
  );
};

// ... rest of your existing code ...

export const getCart = async () => {
  try {
    let cart = await AsyncStorage.getItem(SecureStoreKeys.Cart);
    if (cart) {
      return JSON.parse(cart);
    }
    await AsyncStorage.setItem(SecureStoreKeys.Cart, JSON.stringify([]));
    return [];
  } catch (err) {
    await AsyncStorage.setItem(SecureStoreKeys.Cart, JSON.stringify([]));
    return [];
  }
};

export const setCart = async (item, quantity) => {
  let cart = await AsyncStorage.getItem(SecureStoreKeys.Cart);
  if (cart) {
    cart = JSON.parse(cart);
  } else {
    cart = [];
  }
  let found = false;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === item) {
      cart[i].quantity = quantity;
      found = true;
      break;
    }
  }
  if (!found) {
    cart.push({ id: item, quantity: quantity });
  }
  await AsyncStorage.setItem(SecureStoreKeys.Cart, JSON.stringify(cart));
};
