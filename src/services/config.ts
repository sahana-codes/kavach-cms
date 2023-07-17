import axios, { AxiosError } from 'axios';
import { API_URL } from './apiURL';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem('authToken');
    if (authToken && !config.url?.includes('/admin/login')) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized or token expired
      localStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

// import axios, { AxiosResponse } from 'axios';
// import { API_URL } from './apiURL';

// const handleError = (err: any) => {
//   if (import.meta.env.NODE_ENV === 'development') {
//     console.log('Api Request Error -> request.js : ', { err });
//   }
// };

// const successResponse = (response: AxiosResponse) => ({
//   status: response.status,
//   statusText: response.statusText,
//   ...response.data,
// });

// const errorResponse = function (error: any) {
//   handleError(error);
//   if (error.response) {
//     return {
//       status: error?.response?.status,
//       data: error?.response?.data,
//       error: error?.response?.data?.message,
//     };
//   } else if (error.request) {
//     return {
//       ...error,
//       error: error?.message || 'Client Request error',
//     };
//   }
//   return {
//     error: error?.message || error,
//   };
// };

// // interceptor to handle 401 error
// axios.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     try {
//       if (error.response && error.response.status === 401) {
//         //redirect to /login page if user is expired
//       }
//     } catch (err) {
//       //logout user
//       console.log('logout');
//     }
//     return Promise.reject(error);
//   }
// );

// const _authorizationHeaders = () => {
//   return {
//     'Content-Type': 'application/json',
//   };
// };

// export const getRequest = async (
//   url: string,
//   headers = _authorizationHeaders()
// ) => {
//   try {
//     const res = await axios.get(API_URL + url, {
//       headers: Object.assign({}, headers),
//     });
//     return successResponse(res);
//   } catch (err) {
//     throw errorResponse(err);
//   }
// };

// export const getPaginatedRequest = async (
//   url: string,
//   pageNumber: number,
//   pageSize: number,
//   params: any = {},
//   headers = _authorizationHeaders()
// ) => {
//   const clearedParams: any = {};
//   Object.keys(params).forEach((key) => {
//     if (typeof params[key] === 'string' && params[key]) {
//       clearedParams[key] = params[key];
//     }
//   });
//   const queryString = new URLSearchParams(clearedParams).toString();
//   const newUrl =
//     url +
//     `?pageNumber=${pageNumber}&pageSize=${pageSize}${
//       queryString ? '&' + queryString : ''
//     }`;

//   try {
//     const res = await axios.get(API_URL + newUrl, {
//       headers: Object.assign({}, headers),
//     });
//     return successResponse(res);
//   } catch (err) {
//     throw errorResponse(err);
//   }
// };

// export const postRequest = async (
//   url: string,
//   data = {},
//   headers = _authorizationHeaders()
// ) => {
//   try {
//     const res = await axios({
//       url: API_URL + url,
//       method: 'POST',
//       headers: Object.assign({}, headers),
//       data,
//     });
//     return successResponse(res);
//   } catch (err) {
//     throw errorResponse(err);
//   }
// };

// export const putRequest = async (
//   url: string,
//   data = {},
//   headers = _authorizationHeaders()
// ) => {
//   try {
//     const res = await axios({
//       url: API_URL + url,
//       method: 'PUT',
//       headers: Object.assign({}, headers),
//       data,
//     });
//     return successResponse(res);
//   } catch (err) {
//     throw errorResponse(err);
//   }
// };

// export const patchRequest = async (
//   url: string,
//   data = {},
//   headers = _authorizationHeaders()
// ) => {
//   try {
//     const res = await axios({
//       url: API_URL + url,
//       method: 'PATCH',
//       headers: Object.assign({}, headers),
//       data,
//     });
//     return successResponse(res);
//   } catch (err) {
//     throw errorResponse(err);
//   }
// };

// export const deleteRequest = async (
//   url: string,
//   headers = _authorizationHeaders()
// ) => {
//   try {
//     const res = await axios({
//       url: API_URL + url,
//       method: 'DELETE',
//       headers: Object.assign({}, headers),
//     });
//     return successResponse(res);
//   } catch (err) {
//     throw errorResponse(err);
//   }
// };

// export const Api = {
//   deleteRequest,
//   getPaginatedRequest,
//   getRequest,
//   postRequest,
//   putRequest,
//   patchRequest,
// };
