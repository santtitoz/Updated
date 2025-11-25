// app/components/UserFetcher.tsx

"use client";

import React, { useState, useEffect } from 'react';
// Importa a instância configurada
import axiosInstance from '@/lib/axiosInstance'; 
import axios from 'axios'; // Importa o Axios para tratamento de erros

// Definição da Tipagem CORRIGIDA para o Objeto de Perfil
interface UserProfile {
  id: number;
  user: number; 
  nome: string;
  arroba: string;
  stack: string;
  bio: string;
  skills: string;
  xp: number;
  exercicios_concluidos: number;
  trilhas_concluidas: number;
  dias_conectados: number;
}

const UserFetcher: React.FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🚨 CORREÇÃO DO 404: O PATH RELATIVO DEVE COMEÇAR COM BARRA.
  const DJANGO_API_PATH: string = '/users/profile/'; 

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // Usa axiosInstance.get - A autenticação e renovação são automáticas.
        const response = await axiosInstance.get(DJANGO_API_PATH);
        
        let data = response.data;
        
        // Ajuste para garantir que 'data' seja um array
        if (data && !Array.isArray(data)) {
            data = [data]; 
        }

        setProfiles(data as UserProfile[]); 
        
      } catch (err) {
        let errorMessage = "Ocorreu um erro desconhecido.";
        
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 404) {
                // 🚨 Se for 404, confirma problema na URL
                errorMessage = `Erro 404: O caminho '${DJANGO_API_PATH}' não foi encontrado no servidor.`;
            } else if (err.response?.status === 401) {
                // Se a renovação falhou
                errorMessage = "Sessão expirada. O Refresh Token não conseguiu renovar o acesso. Faça login novamente.";
            } else if (err.response) {
                 errorMessage = `Erro HTTP ${err.response.status}: ${JSON.stringify(err.response.data)}`;
            }
        } else if (err instanceof Error) {
            errorMessage = err.message;
        }
        
        setError(errorMessage);
        
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // 3. Renderização
  if (isLoading) {
    return <p>Carregando dados do Django...</p>;
  }

  if (error) {
    return (
      <div style={{ padding: '10px', border: '1px solid red', color: 'red' }}>
        <h3>Erro ao Carregar Perfis</h3>
        <p>{error}</p>
        <p>URL Base: <code>{axiosInstance.defaults.baseURL}</code></p>
        <p>Caminho Solicitado: <code>{DJANGO_API_PATH}</code></p>
      </div>
    );
  }

  return (
    <div>
      <h2>Lista de Perfis (via Django API)</h2>
      
      {profiles && profiles.length > 0 ? (
        <ul>
          {profiles.map((profile) => (
            // Renderização dos dados
            <li key={profile.id} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
              <strong>ID do Perfil:</strong> {profile.id} <br/>
              <strong>Nome Completo:</strong> {profile.nome} <br/>
              <strong>Arroba:</strong> {profile.arroba} <br/>
              <strong>Stack:</strong> {profile.stack} <br/>
              <strong>XP:</strong> {profile.xp} <br/>
              {/* <strong>Dias Conectados:</strong> {profile.dias_conectados} <br/>
              <strong>Trilhas Concluídas:</strong> {profile.trilhas_concluidas} <br/> */}
              <strong>Skills:</strong> {profile.skills} <br/>
              <strong>Bio:</strong> {profile.bio} <br/>
              {/* <strong>Exercícios Concluídos:</strong> {profile.exercicios_concluidos} */}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum perfil encontrado na API.</p>
      )}
    </div>
  );
}

export default UserFetcher;