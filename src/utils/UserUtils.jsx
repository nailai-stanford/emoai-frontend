import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import {APIs, POST} from './API';
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

  return new Promise(async (resolve, reject) => {
    try {
      const hasPlayService = await GoogleSignin.hasPlayServices();
      if (hasPlayService) {
        GoogleSignin.signIn()
          .then(async (userInfo) => {
            const { idToken, scopes, user } = userInfo;
            payload = {
              idToken: idToken,
              email: user.email,
              source: 'google',
              sourceId: user.id,
              firstName: user.givenName ? user.givenName : "",
              lastName: user.familyName ? user.familyName : "",
              photo: user.photo
            };
            resp = await POST(APIs.USER_LOGIN, payload);
            if (resp.status === 200) {
              userInfo = {
                jwt: resp.data.user.jwt,
                user: resp.data.user
              }
              setUserInfoInStore(userInfo);
              resolve({ resp, userInfo });
            }
          })
          .catch(e => {
            handleError(e);
            reject(e);
          });
      }
    } catch (e_2) {
      handleError(e_2);
      reject(e_2);
    }
  });
};
