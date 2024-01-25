export const SecureStoreKeys = {
  IDToken: "idToken",
  UserInfo: "UserInfo",
  Cart: "Cart",
};

export const handleError = (e) => {
  console.log("ERROR IS: " + JSON.stringify(e));
};

export const handleResponse = (response, additionalInfo) => {
  console.log("response", response);
  console.log("additionalInfo", additionalInfo);
};
