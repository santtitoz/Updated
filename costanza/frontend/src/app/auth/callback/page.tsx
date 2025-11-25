'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const API_BASE_URL = 'http://localhost:8000';
const REDIRECT_URI = 'http://localhost:3000/auth/callback';

const SocialAuthCallbackPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Processando autenticação...');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (code) {
      handleDjoserAuth(code);
    } else {
      setMessage('Falha na autenticação. Código não encontrado.');
      if (window.opener) {
        window.opener.postMessage({ type: 'AUTH_FAILED' }, '*');
        window.close();
      } else {
        setTimeout(() => router.push('/auth/login'), 2000);
      }
    }
  }, [searchParams, router]);

  const handleDjoserAuth = async (code: string) => {
    const API_ENDPOINT = `${API_BASE_URL}/api/auth/o/github/`;

    try {
      setMessage('Trocando código de autorização por tokens...');

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          redirect_uri: REDIRECT_URI,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Login Social bem-sucedido. Redirecionando...');

        // 1. Armazena os tokens
        if (data.access) {
          localStorage.setItem('access_token', data.access);
          if (data.refresh) {
            localStorage.setItem('refresh_token', data.refresh);
          }
        }

        // 2. Notifica a janela principal ou redireciona
        if (window.opener) {
          // Pop-up: envia mensagem e fecha
          window.opener.postMessage({ type: 'AUTH_SUCCESS', tokens: data }, '*');
          window.close();
        } else {
          // Navegação direta: redireciona para a home
          window.location.href = '/';
        }

      } else {
        setMessage(`Erro: ${data.detail || 'Não foi possível obter tokens.'}`);
        console.error('Falha na troca de código do Djoser:', data);
        if (window.opener) {
          window.opener.postMessage({ type: 'AUTH_FAILED', error: data }, '*');
          window.close();
        } else {
          setTimeout(() => router.push('/auth/login'), 2000);
        }
      }
    } catch (error) {
      setMessage('Erro de rede ao conectar ao backend.');
      console.error('Erro de rede:', error);
      if (window.opener) {
        window.opener.postMessage({ type: 'AUTH_FAILED', error: 'Network Error' }, '*');
        window.close();
      } else {
        setTimeout(() => router.push('/auth/login'), 2000);
      }
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Autenticação Social</h1>
      <p>{message}</p>
      <p>Se esta janela não fechar automaticamente, por favor, feche-a.</p>
    </div>
  );
};

export default SocialAuthCallbackPage;