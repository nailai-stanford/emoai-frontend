import {Config} from './Config';
import axios from "axios";


export const BASE_URL = String(Config.BASE_URL);

export const APIs = {
  USER_LOGIN: `${BASE_URL}/api/users/login/google`,
  EMAIL_CODE: `${BASE_URL}/api/users/login/email/code`,
  EMAIL_LOGIN: `${BASE_URL}/api/users/login/email`,
  GET_PRODUCTS: `${BASE_URL}/api/products/`,
  POST_HAND_DESIGN: `${BASE_URL}/api/hand_designs/`,
  LIKE_COLLECT: `${BASE_URL}/api/like_collect/`,
  DELETE_LIKE_COLLECT: `${BASE_URL}/api/like_collect/delete/`,
  GET_COLLECTIONS: `${BASE_URL}/api/like_collect/collections/`,
  DESIGN_SETS: `${BASE_URL}/api/design_sets/`,
  PAYMENT: `${BASE_URL}/api/payment/`,
  ORDER: `${BASE_URL}/api/carts/`,
  ORDER_UPDATE:  `${BASE_URL}/api/carts/update`,
  ORDER_FETCH: `${BASE_URL}/api/carts/`,
  ADDRESS: `${BASE_URL}/api/address/`,
};

export const getHeader = (jwt = '') => {
  // https://stackoverflow.com/questions/46337471/how-to-allow-cors-in-react-js
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': [
      'Origin, X-Requested-With, Content-Type, Accept',
      'Authorization',
    ],
  };
  if (jwt.length > 0) {
    headers['Authorization'] = 'Bearer ' + jwt;
  }
  return headers;
};



export const GET = async(url, userInfo, signout) => {
  headers = null
  if (userInfo && userInfo.jwt) {
    headers = getHeader(userInfo.jwt)
  }
  try {
    const response = await axios.get(url, { headers });
    return { status: response.status, data: response.data };
  } catch (e) {
    console.log('GET ', url, 'failed, e:', e)
    if (signout && e.response && e.response.status === 401) {
      signout();
    }
    return { status: e.response ? e.response.status : 500, error: e.message };
  }
}


export const POST = async(url, payload, userInfo, signout) => {
  headers = null
  if (userInfo && userInfo.jwt) {
    headers = getHeader(userInfo.jwt)
  }
  try {
    const response = await axios.post(url, payload, { headers });
    return { status: response.status, data: response.data };
  } catch (e) {
    console.log('POST ', url, 'with payload:', payload, 'failed, e:', e)
    if (signout && e.response && e.response.status === 401) {
      signout();
    }
    return { status: e.response ? e.response.status : 500, error: e.message };
  }
}