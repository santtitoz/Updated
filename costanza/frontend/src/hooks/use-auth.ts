// src/hooks/use-auth.ts
import { useContext } from 'react';
// Importa o Contexto e a interface de tipos do seu arquivo central
import { AuthContext, AuthContextType } from '@/lib/AuthContext'; 

/**
 * Hook customizado para acessar o estado e as funções de autenticação (login, logout, user).
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    // Essa exceção é crucial para garantir que o hook nunca seja usado 
    // fora do componente AuthProvider.
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Retorna o valor do contexto, garantindo que o tipo AuthContextType seja usado.
  return context as AuthContextType; 
};