import { ServiceResponse, createService } from './createService';

export const getAllContent = (
  page?: number,
  size?: number,
  category?: string
): Promise<ServiceResponse> => {
  let url = '/admin/content/all';
  const queryParams: string[] = [];

  if (page) queryParams.push(`page=${page}`);
  if (size) queryParams.push(`size=${size}`);
  if (category) queryParams.push(`category=${category}`);

  if (queryParams.length > 0) {
    url += `?${queryParams.join('&')}`;
  }

  return createService(url, 'GET');
};

export const getContentDetails = (
  contentId: string
): Promise<ServiceResponse> => {
  return createService(`/admin/content/${contentId}`, 'GET');
};

export const createContent = (
  title: string,
  description: string,
  contentKey: string,
  contentType: string,
  readTime?: string
): Promise<ServiceResponse> => {
  const requestBody = {
    title,
    description,
    contentKey,
    contentType,
    readTime,
  };

  return createService('/admin/content/create', 'POST', requestBody);
};

export const updateContent = (
  contentId: string,
  data: any
): Promise<ServiceResponse> => {
  const requestBody = {
    ...data,
  };

  return createService(
    `/admin/content/update/${contentId}`,
    'PATCH',
    requestBody
  );
};
