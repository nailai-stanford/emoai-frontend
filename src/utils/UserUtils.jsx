import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import {APIs, POST} from './API';
import {SecureStoreKeys, handleError, handleResponse} from './Common';
import {Config} from './Config';
import { appleAuth } from '@invertase/react-native-apple-authentication';


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

export const onPressGoogleSignIn = () => {
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
            resp = await POST(APIs.GOOGLE_LOGIN, payload);
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


export async function onAppleButtonPress() {
  console.log("onAppleButtonPress")
  // performs login request
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    // Note: it appears putting FULL_NAME first is important, see issue #293
    requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
  });


  // get current authentication state for user
  // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
  const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);  
  // use credentialState response to ensure the user is authenticated

  if (credentialState === appleAuth.State.AUTHORIZED) {
    // user is authenticated
    payload = {
      jwt_token: appleAuthRequestResponse.identityToken,
    };
    resp = await POST(APIs.APPLE_LOGIN, payload);
    if (resp.status === 200) {
      userInfo = {
        jwt: resp.data.user.jwt,
        user: resp.data.user
      }
      setUserInfoInStore(userInfo);
      return{ resp, userInfo };
    }
  }
}