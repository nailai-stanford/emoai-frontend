import {Config} from './Config';

export const BASE_URL = String(Config.BASE_URL);

export const APIs = {
  USER_LOGIN: `${BASE_URL}/api/users/login/`,
  GET_PRODUCTS: `${BASE_URL}/api/products/`,
  POST_HAND_DESIGN: `${BASE_URL}/api/hand_designs/`,
  LIKE_COLLECT: `${BASE_URL}/api/like_collect/`,
  DELETE_LIKE_COLLECT: `${BASE_URL}/api/like_collect/delete/`,
  GET_COLLECTIONS: `${BASE_URL}/api/like_collect/collections/`,
  PRODUCT_IMAGE_GENERATION: `${BASE_URL}/api/product_image_generation/`,
  MESSAGE: `${BASE_URL}/api/message/`,
  DESIGN_SETS: `${BASE_URL}/api/design_sets/`,
  PAYMENT: `${BASE_URL}/api/payment/`,
  ORDER: `${BASE_URL}/api/carts/`,
};

export const getHeader = (idToken = '') => {
  // https://stackoverflow.com/questions/46337471/how-to-allow-cors-in-react-js
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': [
      'Origin, X-Requested-With, Content-Type, Accept',
      'Authorization',
    ],
  };
  if (idToken.length > 0) {
    headers['Authorization'] = 'Bearer ' + idToken;
  }
  return headers;
};
