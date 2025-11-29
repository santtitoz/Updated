'use client';

import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    ReactNode,
    useCallback,
} from 'react';
import { useRouter } from 'next/navigation';

// Base URL do Django
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ------------------------------------------------------------------
// FUNÇÕES UTILITÁRIAS DE TOKEN
// ------------------------------------------------------------------
// ------------------------------------------------------------------
// FUNÇÕES UTILITÁRIAS DE TOKEN
// ------------------------------------------------------------------
const TOKEN_KEY = 'accessToken'; // Changed to match axiosInstance
const REFRESH_TOKEN_KEY = 'refreshToken';

const setAuthToken = (token: string, refreshToken?: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
        if (refreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
    }
};

const removeAuthToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
};

const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(TOKEN_KEY);
    }
    return null;
};
// ------------------------------------------------------------------

// --- 1. Tipagem (Defina a estrutura dos dados do usuário) ---

interface User {
    id: number;
    username: string;
    email: string;
    // Adicione outros campos necessários aqui
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    accessToken: string | null;
    login: (accessToken: string, refreshToken: string, userData: User) => void;
    logout: () => void;
    loading: boolean;
    // Adicionando a função fetchUserData para ser usada por componentes externos (como LoginPage)
    fetchUserData: (token: string) => Promise<User | null>;
    updateUser: (userData: User) => void;
}

// --- 2. Criação do Contexto ---

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- 3. Hook de Uso (useAuth) ---

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};


// --- 4. Componente Provider ---

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // 4.1. Função para buscar dados do usuário (usada após JWT CREATE ou Social Auth)
    const fetchUserData = useCallback(async (token: string): Promise<User | null> => {
        try {
            const userResponse = await fetch(`${API_URL}/api/auth/users/me/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (userResponse.ok) {
                const userData: User = await userResponse.json();
                return userData;
            }
            return null;
        } catch (error) {
            console.error('Erro de rede ao buscar dados do usuário:', error);
            return null;
        }
    }, []);


    // 4.2. Função de Login
    const login = useCallback((token: string, refreshToken: string, userData: User) => {
        setAuthToken(token, refreshToken);
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(userData));
        }

        setAccessToken(token);
        setUser(userData);

        // Redirecionamento para a Rota Raiz (/)
        router.push('/');
    }, [router]);

    // 4.3. Função de Logout
    const logout = useCallback(() => {
        removeAuthToken();
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
        }

        setAccessToken(null);
        setUser(null);

        // Redirecionamento para Login
        router.push('/auth/login');
    }, [router]);

    // 4.5 Função para atualizar dados do usuário manualmente (sem relogin)
    const updateUser = useCallback((userData: User) => {
        setUser(userData);
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(userData));
        }
    }, []);


    // 4.4. HOOK CENTRALIZADO DE VERIFICAÇÃO E ESCUTA (A CHAVE PARA O LOGIN SOCIAL)
    useEffect(() => {
        // Funções de verificação de token e dados do usuário
        const checkInitialAuth = async () => {
            const token = getAuthToken();
            const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

            if (token && storedUser) {
                // Tenta validar o token buscando os dados do usuário (melhor validação)
                const userData = await fetchUserData(token);

                if (userData) {
                    // Se o token for válido, loga o usuário sem redirecionar (para evitar loops)
                    setAccessToken(token);
                    setUser(userData);
                    // Note: O redirecionamento após a inicialização deve ser feito nas páginas protegidas.
                } else {
                    // Se o token estiver inválido/expirado, desloga
                    logout();
                }
            }
            setLoading(false);
        };

        // ---------------------------------------------------------------------
        // 🟢 LISTENER PARA MENSAGENS DO POP-UP DE LOGIN SOCIAL (A LÓGICA MOVIDA)
        const handleMessage = async (event: MessageEvent) => {
            // ⚠️ Em produção, verifique event.origin para segurança!
            const { type, tokens } = event.data;

            if (type === 'AUTH_SUCCESS' && tokens?.access) {
                console.log("Mensagem de sucesso recebida do pop-up. Processando login...");

                const { access, refresh } = tokens;

                if (refresh && typeof window !== 'undefined') {
                    localStorage.setItem('refresh_token', refresh);
                }

                // Busca dados do usuário (Djoser /api/auth/users/me/)
                const userData = await fetchUserData(access);

                if (userData) {
                    // O login() irá atualizar o estado e redirecionar para /
                    login(access, refresh || '', userData);
                } else {
                    console.error('Falha ao obter dados do usuário após login social.');
                    logout();
                }
            } else if (type === 'AUTH_FAILED') {
                console.error('Falha no Login Social relatada pelo pop-up.');
            }
        };
        // ---------------------------------------------------------------------

        checkInitialAuth();
        if (typeof window !== 'undefined') {
            window.addEventListener('message', handleMessage);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('message', handleMessage);
            }
        };

    }, [fetchUserData, login, logout]);

    const isAuthenticatedValue = !!accessToken && !!user;

    const contextValue: AuthContextType = {
        user,
        isAuthenticated: isAuthenticatedValue,
        accessToken,
        login,
        logout,
        loading,
        fetchUserData, // Exporta para ser usado na LoginPage (login tradicional)
        updateUser,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {/* Exibe um loader enquanto a sessão é verificada no cliente, 
          evitando flash de conteúdo */}
            {loading ? <div className="flex items-center justify-center min-h-screen bg-black text-white">Carregando autenticação...</div> : children}
        </AuthContext.Provider>
    );
};