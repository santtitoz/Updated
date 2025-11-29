'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

/**
 * Página de callback para login social (GitHub, Google)
 * Recebe os tokens JWT via query params e atualiza o estado de autenticação
 */
const SocialCallbackPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [message, setMessage] = useState('Processando login social...');

  useEffect(() => {
    const access = searchParams.get('access');
    const refresh = searchParams.get('refresh');
    const userId = searchParams.get('user_id');
    const userEmail = searchParams.get('user_email');
    const userUsername = searchParams.get('user_username');
    const error = searchParams.get('error');

    if (error) {
      setMessage('Erro no login social. Redirecionando...');
      setTimeout(() => router.push('/auth/login'), 2000);
      return;
    }

    if (access && userId && userEmail) {
      // Cria objeto do usuário
      const userData = {
        id: parseInt(userId),
        username: userUsername || userEmail,
        email: userEmail,
      };

      // Atualiza o contexto de autenticação (que já salva no localStorage corretamente)
      login(access, refresh || '', userData);

      setMessage('Login realizado com sucesso! Redirecionando...');

      // Redireciona para a home
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else {
      setMessage('Dados de autenticação não encontrados. Redirecionando...');
      setTimeout(() => router.push('/auth/login'), 2000);
    }
  }, [searchParams, router, login]);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Autenticação Social</h1>
      <p>{message}</p>
    </div>
  );
};

export default SocialCallbackPage;
