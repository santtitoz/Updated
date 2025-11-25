// src/components/ClientProviders.tsx
'use client'; 

import React from 'react';
import { AuthProvider } from '@/lib/AuthContext'; // Ajuste o alias/caminho

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <AuthProvider>
      {/* Mantenha outros providers de cliente aqui (ex: ThemeProvider, se necessário) */}
      {children}
    </AuthProvider>
  );
}