import { onPressLogout } from "./UserUtils";
import {TABs} from '../static/Constants';


export const SecureStoreKeys = {
  IDToken: "idToken",
  UserInfo: "UserInfo",
  Cart: "Cart",
};

export const handleError = (e, signout) => {
  console.log("ERROR IS: ", e);
  if (e.message) {
    console.log(e.message)
  }
  if (e.stack) {
    console.log("CALL STACK: ", e.stack);
  }

  if (e && e.response && e.response.status && e.response.status == 401) {
    console.log('logout')
    if (signout) {
      signout();
      onPressLogout();
    }
  }
};

export const handleResponse = (response, additionalInfo) => {
  console.log("response", response);
  console.log("additionalInfo", additionalInfo);
};
