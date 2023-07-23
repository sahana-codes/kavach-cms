import axios from 'axios';
import { api } from './config';
import { createService, ServiceResponse } from './createService';
import { openSnackbar } from '../store/snackbarSlice';

export interface S3ResponseData {
  data: { uploadURL?: string; downloadURL?: string; Key?: string };
}

export const getS3UploadURL = (
  fileName: string
): Promise<ServiceResponse<S3ResponseData>> => {
  const bodyData = {
    fileName,
  };

  return createService('/admin/content/get-upload-url', 'POST', bodyData);
};

export const getS3DownloadURL = (
  fileName: string
): Promise<ServiceResponse<S3ResponseData>> => {
  const bodyData = {
    fileName,
  };

  return createService('/admin/content/get-download-url', 'POST', bodyData);
};

export const uploadToS3 = async (
  uploadURL: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.put(uploadURL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          if (onProgress) {
            onProgress(progress);
          }
        }
      },
    });

    return response;
  } catch (error) {
    openSnackbar({
      message: 'Error uploading file to S3',
      severity: 'error',
    });
  }
};
