// lib/axiosInstance.ts
import axios from 'axios';

// 🚨 CORREÇÃO DO 404: Removendo a barra final da BASE_URL
const BASE_URL = 'http://localhost:8000/api/v1';
const TOKEN_REFRESH_URL = 'http://localhost:8000/api/auth/jwt/refresh/';

// 💡 Configuração inicial: SALVA o refresh token APENAS NO CLIENTE (Evita ReferenceError)
// if (typeof window !== 'undefined' && !localStorage.getItem('refreshToken')) {
//   localStorage.setItem('refreshToken', INITIAL_REFRESH_TOKEN);
// }

// Crie a instância base do Axios
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variáveis de controle
let isRefreshing = false;
let failedQueue: { resolve: (value: any) => void; reject: (reason?: any) => void; }[] = [];

// Função que processa a fila de requisições que falharam
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// -------------------------------------------------------------
// 1. INTERCEPTOR DE REQUISIÇÃO (ANEXA O ACCESS TOKEN ANTES DE ENVIAR)
// -------------------------------------------------------------
axiosInstance.interceptors.request.use(
  (config) => {
    let token = null;

    // 🚨 CORREÇÃO DO LOCALSTORAGE: Acesso apenas no lado do cliente
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('accessToken');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// -------------------------------------------------------------
// 2. INTERCEPTOR DE RESPOSTA (DETECTA 401 E RENOVA)
// -------------------------------------------------------------
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isClient = typeof window !== 'undefined';

    // Verifica se é um 401 E que não seja a própria requisição de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Obtém o refresh token
      const REFRESH_TOKEN = isClient ? localStorage.getItem('refreshToken') : null;

      if (!REFRESH_TOKEN) {
        return Promise.reject("Refresh token não encontrado. Sessão expirada.");
      }

      if (isRefreshing) {
        // Adiciona requisições à fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token: any) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      isRefreshing = true;

      try {
        // Envia o refresh token para o endpoint do Django
        const response = await axios.post(TOKEN_REFRESH_URL, {
          refresh: REFRESH_TOKEN,
        });

        const { access: newAccessToken, refresh: newRefreshToken } = response.data;

        // 🚨 CORREÇÃO DO LOCALSTORAGE: Salva os novos tokens apenas no cliente
        if (isClient) {
          localStorage.setItem('accessToken', newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }
        }

        // Atualiza cabeçalhos
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Processa a fila e repete a requisição original
        processQueue(null, newAccessToken);
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // Falha na renovação: Limpa tokens e força logout
        if (isClient) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          // Force redirect to login
          window.location.href = '/auth/login';
        }
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;