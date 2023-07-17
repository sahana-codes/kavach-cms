export const API_URL =
  import.meta.env.REACT_APP_API_ENV === 'production'
    ? 'prod-url'
    : 'http://13.232.201.105:32773/';

export const CLIENT_PUBLIC_URL = ((env) => {
  if (env === 'development') return 'client-url-dev';
  else if (env === 'production') return 'client-url-prod';
  return 'http://localhost:3000';
})(import.meta.env.NODE_ENV);
