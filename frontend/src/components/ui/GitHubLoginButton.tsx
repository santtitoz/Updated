// src/components/ui/GitHubLoginButton.tsx
'use client'; // Necessário pois usa window.location

import React from 'react';

// URL para iniciar o fluxo OAuth no seu Backend Django/Allauth
const GITHUB_LOGIN_URL = 'http://localhost:8000/accounts/github/login/';

const GitHubLoginButton: React.FC = () => {
  const handleLogin = () => {
    // Redireciona o usuário para o endpoint inicial do Django/Allauth
    window.location.href = GITHUB_LOGIN_URL;
  };

  return (
    <button 
      onClick={handleLogin}
      style={{ padding: '10px 20px', backgroundColor: '#333', color: 'white', cursor: 'pointer' }}
    >
      Login com GitHub
    </button>
  );
};

export default GitHubLoginButton;