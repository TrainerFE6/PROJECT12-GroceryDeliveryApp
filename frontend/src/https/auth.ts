import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
// import store from '@rematch-store';

export const defaultHeaders = {};

const options = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  validateStatus: null,
};

const getCoreApiResponseOk = (code: number) => code >= 200 && code < 300;

const responseInterceptor = (response: AxiosResponse): any => {
  const { data: responseData, status: responseStatus } = response;
  const { message, data } = responseData;

  const okStatus = getCoreApiResponseOk(responseStatus);

  if (responseStatus === 401) {
    // console.log('auth 401');
    // store.dispatch({ type: 'user/handleLogout' });
  }

  if (okStatus) {
    return {
      data,
      message,
    };
  }

  throw new Error(message);
};

const errorInterceptor = (error: AxiosError): Promise<AxiosError> => Promise.reject(error);

const instance: AxiosInstance = axios.create(options);

instance.defaults.headers.common = defaultHeaders;

instance.interceptors.response.use(responseInterceptor, errorInterceptor);

export const setAuthAccessTokenHeader = (token: string) => {
  instance.defaults.headers.common['Access-Token'] = token;
};

export const setAuthAuthorizationHeader = (token: string) => {
  instance.defaults.headers.common.Authorization = token;
};

export const removeAuthAuthorizationHeader = () => {
  delete instance.defaults.headers.common.Authorization;
};

export default instance;
