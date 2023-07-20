import { ServiceResponse, createService } from './createService';

export const getAllAdmins = (): Promise<ServiceResponse> => {
  return createService('/admin/all', 'GET');
};

export const getCurrentAdmin = (): Promise<ServiceResponse> => {
  return createService('/admin/current', 'GET');
};

export const createNewAdmin = (
  username: string,
  password: string
): Promise<ServiceResponse> => {
  return createService('/admin/new', 'POST', { username, password });
};

export const updateAdmin = (
  username: string,
  newPassword: string
): Promise<ServiceResponse> => {
  return createService(`/admin/update/${username}`, 'PATCH', {
    password: newPassword,
  });
};

export const deleteAdmin = (username: string): Promise<ServiceResponse> => {
  return createService(`/admin/delete/${username}`, 'DELETE');
};

export const login = async (
  username: string,
  password: string
): Promise<ServiceResponse> => {
  const body = {
    username,
    password,
  };

  return createService('/admin/login', 'POST', body, true);
};
