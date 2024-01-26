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
    // We should make sure that this console.log doesn't get called very frequently
    console.log("getUserInfoFromStore", userInfo);
    return userInfo;
  }
  return null;
};

export const onPressLogout = async () => {
  await AsyncStorage.removeItem(SecureStoreKeys.UserInfo);
};

export const setUserInfoInStore = async (UserInfo) => {
  await AsyncStorage.setItemAsync(
    SecureStoreKeys.UserInfo,
    JSON.stringify(UserInfo)
  );
};

export const onPressSignIn = () => {
  GoogleSignin.configure({
    androidClientId: Config.ANDROID_CLIENT_ID,
    iosClientId: Config.IOS_CLIENT_ID,
  });

  return new Promise((resolve, reject) => {
    return GoogleSignin.hasPlayServices()
      .then((hasPlayService) => {
        if (hasPlayService) {
          GoogleSignin.signIn()
            .then((userInfo) => {
              const headers = getHeader();
              const { idToken, scopes, user } = userInfo;
              axios
                .post(
                  APIs.USER_LOGIN,
                  {
                    idToken: idToken,
                    email: user.email,
                    source: "google",
                    sourceId: user.id,
                    firstName: user.givenName,
                    lastName: user.familyName,
                  },
                  { headers }
                )
                .then((response) => {
                  setUserInfoInStore(userInfo);
                  handleResponse(response, userInfo);
                  resolve({ response, userInfo });
                })
                .catch((e) => {
                  handleError(e);
                  reject(e);
                });
            })
            .catch((e) => {
              handleError(e);
              reject(e);
            });
        }
      })
      .catch((e) => {
        handleError(e);
        reject(e);
      });
  });
};

export const getCart = async () => {
  try {
    let cart = await AsyncStorage.getItem(SecureStoreKeys.Cart);
    cart = JSON.parse(cart);
    if (cart) {
      return cart;
    }
    await AsyncStorage.setItem(SecureStoreKeys.Cart, JSON.stringify([]));
  } catch (err) {
    await AsyncStorage.setItem(SecureStoreKeys.Cart, JSON.stringify([]));
  }
}

export const setCart = async (item, quantity) => {
  let cart = await AsyncStorage.getItem(SecureStoreKeys.Cart);
  cart = JSON.parse(cart);
  let found = false;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === item) {
      cart[i].quantity = quantity
      found = true;
      break;
    }
  }
  if (!found) {
    cart.push({id: item, quantity: quantity})
  }
  await AsyncStorage.setItem(SecureStoreKeys.Cart, JSON.stringify(cart));
};
