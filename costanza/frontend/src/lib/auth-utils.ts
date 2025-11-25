// src/lib/auth-utils.ts

export const TOKEN_KEY = 'auth_token';
export const USER_DATA_KEY = 'user';

/**
 * Salva o token de autenticação no localStorage.
 */
export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

/**
 * Obtém o token de autenticação do localStorage.
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

/**
 * Remove o token E os dados do usuário do localStorage.
 * (Ajustado para limpar os dados do usuário para o AuthContext)
 */
export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY); // <--- Adicionado para limpar os dados do AuthContext
  }
}

/**
 * Verifica se o usuário está autenticado.
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
}

/**
 * Função helper de API que anexa o cabeçalho de Autorização (Token)
 * a requisições usando a API Fetch.
 */
export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    // Usa o formato 'Token <token>' exigido pela TokenAuthentication do Django
    ...(token && { Authorization: `Token ${token}` }), 
    ...options.headers,
  }

  return fetch(url, {
    ...options,
    headers,
  })
}