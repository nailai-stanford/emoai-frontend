import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import {APIs, getHeader} from './API';
import {SecureStoreKeys, handleError, handleResponse} from './Common';
import {Config} from './Config';

export const getUserInfoFromStore = async () => {
  let userInfo = await AsyncStorage.getItem(SecureStoreKeys.UserInfo);
  if (userInfo) {
    userInfo = JSON.parse(userInfo);
    // We should make sure that this console.log doesn't get called very frequently
    return userInfo;
  }
  return null;
};

export const onPressLogout = async () => {
  await AsyncStorage.removeItem(SecureStoreKeys.UserInfo);
};

export const setUserInfoInStore = async (UserInfo) => {
  try {
      await AsyncStorage.setItem(
        SecureStoreKeys.UserInfo,
        JSON.stringify(UserInfo),
      );
    } catch(error) {
      console.log(error)
    }
};

export const onPressSignIn = () => {
  GoogleSignin.configure({
    androidClientId: Config.ANDROID_CLIENT_ID,
    iosClientId: Config.IOS_CLIENT_ID,
  });

  return new Promise((resolve, reject) => {
    return GoogleSignin.hasPlayServices()
      .then(hasPlayService => {
        if (hasPlayService) {
          GoogleSignin.signIn()
            .then(userInfo => {
              const headers = getHeader();
              const {idToken, scopes, user} = userInfo;
              axios
                .post(
                  APIs.USER_LOGIN,
                  {
                    idToken: idToken,
                    email: user.email,
                    source: 'google',
                    sourceId: user.id,
                    firstName: user.givenName ? user.givenName: "",
                    lastName: user.familyName ? user.familyName: "",
                  },
                  {headers},
                )
                .then(response => {
                  setUserInfoInStore(userInfo);
                  console.log('login user_info:', userInfo)
                  handleResponse(response, userInfo);
                  resolve({response, userInfo});
                })
                .catch(e => {
                  handleError(e);
                  reject(e);
                });
            })
            .catch(e => {
              handleError(e);
              reject(e);
            });
        }
      })
      .catch(e => {
        handleError(e);
        reject(e);
      });
  });
};
