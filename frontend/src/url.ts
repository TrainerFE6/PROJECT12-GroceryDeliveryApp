// export const baseUrl = 'https://grocery-backend.web-ditya.my.id/api';
export const baseUrl = 'http://localhost:5000/api';
export const asset = (path: string) => `${baseUrl.replace('/api', '')}/${path}`;