import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { baseUrl as url } from '../url';

export const defaultHeaders = {};

const options = {
  // baseUrl: url,
  // baseURL: 'https://grocery-backend.web-ditya.my.id/api',
  baseURL: 'http://localhost:5000/api',
  timeout: 60000,
};

export interface PaginationParams {
  page: number;
  perPage: number;
}

export interface Metadata {
  page?: number;
  perPage?: number;
  totalPages?: number;
  totalRows?: number;
}

export interface CoreHttpResponse<D> {
  status: number;
  message: string;
  data: D;
  metadata?: {
    page?: number;
    perPage?: number;
    totalPages?: number;
    totalRows?: number;
  };
}

const responseInterceptor = async (response: AxiosResponse): Promise<any> => {

  if (response.status >= 200 && response.status < 300) {
    return {
      ...response.data,
    };
  }

  return Promise.reject(response?.data);
};

const errorInterceptor = (error: any) => {
  if (error?.response?.status < 200 && error?.response?.status >= 300) {
    // If response status 403 no permission for the request we can force user logout
    // Ex: store.dispatch(usersActions.logout());
    return Promise.reject(error?.response?.data);
  }

  if (error?.response?.status === 403) {
    // If response status 403 no permission for the request we can force user logout
    // Ex: store.dispatch(usersActions.logout());
    return Promise.reject(error?.response?.data);
  }

  if (error?.response?.status === 401) {
    // Other error not 401 we can safely return error
    // dispatch({ type: 'user/handleLogout' });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    
    window.location.href = '/#/login';
    return Promise.reject(error?.response?.data);
  }

  return Promise.reject(error?.response?.data);
};

const instance: AxiosInstance = axios.create(options);

instance.defaults.headers.common = defaultHeaders;

// Add interceptor to add token from localStorage
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(responseInterceptor, errorInterceptor);

export default instance;
