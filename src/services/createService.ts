import { AxiosError, AxiosRequestConfig, AxiosResponseHeaders } from 'axios';
import { api } from './config';

export type ServiceResponse<T = any> = {
  message: string;
  data: T;
};

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const createService = <T>(
  path: string,
  method: RequestMethod,
  data?: any,
  isLogin: boolean = false
): Promise<ServiceResponse<T>> => {
  const config: AxiosRequestConfig = {
    url: path,
    method,
    data,
  };

  return new Promise<ServiceResponse<T>>((resolve, reject) => {
    api
      .request(config)
      .then((response) => {
        if (isLogin) {
          const authToken = response.headers['x-auth-token'];
          if (authToken) {
            localStorage.setItem('authToken', authToken);
          }
        }
        resolve({
          message: 'Success',
          data: response.data,
        });
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          const errorMessage: any = error.response.data;
          reject({ message: errorMessage.error, data: null });
        } else if (error.request) {
          reject({ message: 'No response from the server', data: null });
        } else {
          reject({ message: 'Failed to send the request', data: null });
        }
      });
  });
};
