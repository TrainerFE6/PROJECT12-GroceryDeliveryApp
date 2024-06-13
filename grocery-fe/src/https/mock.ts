/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable new-cap */
/* eslint-disable arrow-body-style */
import instance from '@/https/core';
import axiosMockAdapter from 'axios-mock-adapter';
import { random } from 'lodash';

// Start Mock Server
const mockServer = new axiosMockAdapter(instance, { delayResponse: 500, onNoMatch: 'passthrough' });
function route(path:string = '') {
  return typeof path === 'string'
    ? new RegExp(path.replace(/:\w+/g, '[^/]+'))
    : path;
}

// Mocking example data
const dataPosition = [
  {
    id: 'd09f25b6-835e-4fe6-a9a0-421913f48dd3',
    name: 'Posisi D',
    created_at: '2024-05-29T21:07:48.16171+07:00',
    updated_at: '2024-05-29T21:54:34.319602+07:00',
    deleted_at: null,
  },
];
const dataProvince = [
  {
    id: '979161dd-25f0-434c-93c6-b2d0d7d17539',
    name: 'Jawa Barat',
    created_at: '2024-05-29T23:20:15.033903+07:00',
    updated_at: '2024-05-29T23:20:15.033903+07:00',
    deleted_at: null,
  },
  {
    id: '31829bf6-617c-43a5-96a8-7cd8f5922aed',
    name: 'DKI Jakarta',
    created_at: '2024-05-29T23:20:50.130821+07:00',
    updated_at: '2024-05-29T23:20:50.130821+07:00',
    deleted_at: null,
  },
];

const dataCity = [
  {
    id: '07642a01-94eb-4b1f-8bd9-92478074657e',
    province_id: '31829bf6-617c-43a5-96a8-7cd8f5922aed',
    name: 'Jakarta Pusat',
    created_at: '2024-05-30T00:02:24.920068+07:00',
    updated_at: '2024-05-30T00:02:24.920068+07:00',
    deleted_at: null,
  },
  {
    id: 'f765d3ca-eb72-4d8b-a7b6-61166f5dd2e3',
    province_id: '31829bf6-617c-43a5-96a8-7cd8f5922aed',
    name: 'Jakarta Utara',
    created_at: '2024-05-30T00:11:37.462443+07:00',
    updated_at: '2024-05-30T00:11:37.462443+07:00',
    deleted_at: null,
  },
];

// Start Province Mocking
mockServer.onGet('http://localhost:3030/api/ms/positions').reply(() => {
  return [200, {
    data: dataPosition,
    message: 'success',
    metadata: {
      page: 1,
      per_page: 10,
      total_pages: 1,
      total_rows: 1,
    },
    success: true,
  }];
});

mockServer.onPost('http://localhost:3030/api/ms/positions').reply((config) => {
  const payload = JSON.parse(config.data);
  dataPosition.push({
    id: `IDD-${random(1000, 9999)}`,
    name: payload.name,
    created_at: '2024-05-29T21:07:48.16171+07:00',
    updated_at: '2024-05-29T21:54:34.319602+07:00',
    deleted_at: null,
  });
  return [201, {
    data: {
      id: '33acf329-bbb1-450f-aa20-d9187ea47b20',
    },
    message: 'User Created',
    success: true,
  }];
});

mockServer.onGet(route('http://localhost:3030/api/ms/positions/:id')).reply((config) => {
  const positionId = config?.url?.split('/').pop();
  const position = dataPosition.find((pos) => pos.id === positionId);
  if (position) {
    return [200, {
      data: position,
      message: 'success',
      success: true,
    }];
  }
  return [404, {
    message: 'Position not found',
    success: false,
  }];
});

mockServer.onPut(route('http://localhost:3030/api/ms/positions/:id')).reply((config) => {
  const positionId = config?.url?.split('/').pop();
  const payload = JSON.parse(config.data);
  const positionIndex = dataPosition.findIndex((pos) => pos.id === positionId);
  if (positionIndex !== -1) {
    dataPosition[positionIndex] = {
      ...dataPosition[positionIndex],
      name: payload.name,
      updated_at: new Date().toISOString(),
    };
    return [200, {
      message: 'Position Updated',
      success: true,
    }];
  }
  return [200, {
    message: 'Position not found',
    success: false,
  }];
});

mockServer.onDelete(route('http://localhost:3030/api/ms/positions/:id')).reply((config) => {
  const positionId = config?.url?.split('/').pop();
  const positionIndex = dataPosition.findIndex((pos) => pos.id === positionId);
  if (positionIndex !== -1) {
    dataPosition.splice(positionIndex, 1);
    return [200, {
      data: true,
      message: 'Position Deleted',
      success: true,
    }];
  }
  return [404, {
    message: 'Position not found',
    success: false,
  }];
});
// End Province Mocking

// Provinces Endpoints
mockServer.onGet('http://localhost:3030/api/ms/provinces').reply(200, {
  data: dataProvince,
  message: 'success',
  metadata: {
    page: 1,
    per_page: 10,
    total_pages: 1,
    total_rows: dataProvince.length,
  },
  success: true,
});

mockServer.onPost('http://localhost:3030/api/ms/provinces').reply((config) => {
  const payload = JSON.parse(config.data);
  const newProvince = {
    id: `IDD-${random(1000, 9999)}`,
    name: payload.name,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  };
  dataProvince.push(newProvince);
  return [201, {
    data: { id: newProvince.id },
    message: 'Province Created',
    success: true,
  }];
});

mockServer.onGet(/http:\/\/localhost:3030\/api\/ms\/provinces\/.+/).reply((config) => {
  const provinceId = config?.url?.split('/').pop();
  const province = dataProvince.find((prov) => prov.id === provinceId);
  if (province) {
    return [200, { data: province, message: 'success', success: true }];
  }
  return [404, { message: 'Province not found', success: false }];
});

mockServer.onPut(/http:\/\/localhost:3030\/api\/ms\/provinces\/.+/).reply((config) => {
  const provinceId = config?.url?.split('/').pop();
  const payload = JSON.parse(config.data);
  const provinceIndex = dataProvince.findIndex((prov) => prov.id === provinceId);
  if (provinceIndex !== -1) {
    dataProvince[provinceIndex] = {
      ...dataProvince[provinceIndex],
      name: payload.name,
      updated_at: new Date().toISOString(),
    };
    return [200, { message: 'Province Updated', success: true }];
  }
  return [404, { message: 'Province not found', success: false }];
});

mockServer.onDelete(/http:\/\/localhost:3030\/api\/ms\/provinces\/.+/).reply((config) => {
  const provinceId = config?.url?.split('/').pop();
  const provinceIndex = dataProvince.findIndex((prov) => prov.id === provinceId);
  if (provinceIndex !== -1) {
    dataProvince.splice(provinceIndex, 1);
    return [200, { data: true, message: 'Province Deleted', success: true }];
  }
  return [404, { message: 'Province not found', success: false }];
});

// Cities Endpoints
mockServer.onGet('http://localhost:3030/api/ms/city').reply(200, {
  data: dataCity,
  message: 'success',
  metadata: {
    page: 1,
    per_page: 10,
    total_pages: 1,
    total_rows: dataCity.length,
  },
  success: true,
});

mockServer.onPost('http://localhost:3030/api/ms/city').reply((config) => {
  const payload = JSON.parse(config.data);
  const newCity = {
    id: `IDD-${random(1000, 9999)}`,
    province_id: payload.province_id,
    name: payload.name,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  };
  dataCity.push(newCity);
  return [201, {
    data: { id: newCity.id },
    message: 'City Created',
    success: true,
  }];
});

mockServer.onGet(/http:\/\/localhost:3030\/api\/ms\/city\/.+/).reply((config) => {
  const cityId = config?.url?.split('/').pop();
  const city = dataCity.find((x) => x.id === cityId);
  if (city) {
    return [200, { data: city, message: 'success', success: true }];
  }
  return [404, { message: 'City not found', success: false }];
});

export default instance;
