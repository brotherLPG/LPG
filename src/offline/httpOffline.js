import axios from 'axios';
import {
  canQueueWrite,
  markAuthRequired,
  mergePendingIntoResponse,
  rememberOnlineResponse,
  serveGet,
  serveWrite,
} from './repository';
import { startSyncLoop, syncNow } from './syncEngine';

let installed = false;
let refreshPromise = null;

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('No refresh token');
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/refresh`,
    { refreshToken }
  );
  const accessToken = response.data?.data?.accessToken;
  const nextRefresh = response.data?.data?.refreshToken;
  if (!accessToken) throw new Error('Refresh failed');
  localStorage.setItem('token', accessToken);
  if (nextRefresh) localStorage.setItem('refreshToken', nextRefresh);
  await markAuthRequired(false);
  return accessToken;
}

function axiosResponse(config, data, status = 200) {
  return {
    data,
    status,
    statusText: 'OK',
    headers: {},
    config,
  };
}

async function offlineResult(config) {
  if (config.skipOffline) return null;
  const method = String(config.method || 'get').toLowerCase();
  if (method === 'get') {
    const data = await serveGet(config);
    if (!data) return null;
    return axiosResponse(config, data);
  }
  if (canQueueWrite(config) || method === 'post' || method === 'patch' || method === 'put' || method === 'delete') {
    const data = await serveWrite(config);
    return axiosResponse(config, data, method === 'post' ? 201 : 200);
  }
  return null;
}

export function installOffline(api) {
  if (installed) return;
  installed = true;

  api.interceptors.request.use(async (config) => {
    if (config.skipOffline || navigator.onLine) return config;
    const offline = await offlineResult(config);
    if (!offline) return config;
    config.adapter = async () => offline;
    return config;
  });

  api.interceptors.response.use(
    async (response) => {
      if (!response.config?.skipOffline && response.config) {
        await rememberOnlineResponse(response.config, response.data);
        try {
          response.data = await mergePendingIntoResponse(response.config, response.data);
        } catch {
          // Keep the server payload if the local database cannot be read.
        }
      }
      return response;
    },
    async (error) => {
      const config = error.config;
      const status = error.response?.status;
      if (status === 401 && config && !config.skipOffline && !config._retry && navigator.onLine) {
        config._retry = true;
        try {
          const token = await (refreshPromise || (refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          })));
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
          return api(config);
        } catch (refreshError) {
          localStorage.removeItem('token');
          await markAuthRequired(true);
          return Promise.reject(refreshError);
        }
      }

      if (config && !config.skipOffline && (!error.response || !navigator.onLine)) {
        try {
          const offline = await offlineResult(config);
          if (offline) return offline;
        } catch (offlineError) {
          return Promise.reject(offlineError);
        }
      }
      return Promise.reject(error);
    }
  );

  startSyncLoop();
}

export function afterOnlineLogin() {
  markAuthRequired(false).then(() => syncNow());
}
