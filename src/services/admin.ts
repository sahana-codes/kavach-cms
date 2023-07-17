import { AxiosError } from 'axios';
import { api } from './config';

interface Response {
  message: string;
  data: any;
}

export const login = (
  username: string,
  password: string
): Promise<Response> => {
  return new Promise<Response>((resolve, reject) => {
    api
      .post('/admin/login', {
        username,
        password,
      })
      .then((response) => {
        // Store the token in localStorage
        localStorage.setItem('authToken', response.headers['x-auth-token']);
        resolve({ message: 'Login successful', data: response.data });
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          if (error.response.status === 401) {
            reject({ message: 'Invalid username or password', data: null });
          } else if (error.response.status === 403) {
            reject({
              message: 'Access forbidden. Please contact support',
              data: null,
            });
          } else if (error.response.status === 404) {
            reject({ message: 'User not found', data: null });
          } else if (error.response.status === 500) {
            reject({
              message: 'Internal server error. Please try again later',
              data: null,
            });
          } else {
            const errorMessage: any = error.response.data;
            reject({
              message: errorMessage.error,
              data: null,
            });
          }
        } else if (error.request) {
          reject({ message: 'No response from the server', data: null });
        } else {
          reject({ message: 'Failed to send the request', data: null });
        }
      });
  });
};

export const getCurrentAdmin = (): Promise<Response> => {
  return new Promise<Response>((resolve, reject) => {
    api
      .get('/admin/current')
      .then((response) => {
        resolve({ message: 'Current admin retrieved', data: response.data });
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

export const getAllAdmins = (): Promise<Response> => {
  return new Promise<Response>((resolve, reject) => {
    api
      .get('/admin/all')
      .then((response) => {
        resolve({ message: 'Admins retrieved', data: response.data });
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

export const createNewAdmin = (
  username: string,
  password: string
): Promise<Response> => {
  return new Promise<Response>((resolve, reject) => {
    api
      .post('/admin/new', { username, password })
      .then((response) => {
        resolve({ message: 'Admin created successfully', data: response.data });
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

export const updateAdmin = (
  username: string,
  newPassword: string
): Promise<Response> => {
  return new Promise<Response>((resolve, reject) => {
    api
      .patch(`/admin/update/${username}`, { password: newPassword })
      .then((response) => {
        resolve({ message: 'Admin updated successfully', data: response.data });
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

export const deleteAdmin = (username: string): Promise<Response> => {
  return new Promise<Response>((resolve, reject) => {
    api
      .delete(`/admin/delete/${username}`)
      .then((response) => {
        resolve({ message: 'Admin deleted successfully', data: response.data });
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
