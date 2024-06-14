import { AxiosInstance } from 'axios';
import coreAPI from './core';

export function setAccessTokenHeader(token: string): void {
  const instances = [coreAPI];

  instances.forEach((instance: AxiosInstance) => {
    // eslint-disable-next-line no-param-reassign
    instance.defaults.headers.common['Access-Token'] = token;
  });
}

export function setAuthorizationHeader(token: string): void {
  const instances = [coreAPI];

  instances.forEach((instance: AxiosInstance) => {
    // eslint-disable-next-line no-param-reassign
    instance.defaults.headers.common.Authorization = `Bearer ${token}`;
  });
}

export function removeAccessTokenHeader() {
  const instances = [coreAPI];

  instances.forEach((instance: AxiosInstance) => {
    // eslint-disable-next-line no-param-reassign
    delete instance.defaults.headers.common['Access-Token'];
  });
}

export function removeAuthorizationHeader() {
  const instances = [coreAPI];

  instances.forEach((instance: AxiosInstance) => {
    // eslint-disable-next-line no-param-reassign
    delete instance.defaults.headers.common.Authorization;
  });
}
