export interface UserProfile {
  id: number;
  user: number;
  nome: string;
  arroba: string;
  bio: string;
  stack: string;
  skills: string;
  xp: number;
  exercicios_concluidos: number;
  trilhas_concluidas: number;
  dias_conectados: number;
  avatar?: string;
  capa?: string;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  image?: string; 
  earned_at?: string;
}

export interface Friend {
  id: number;
  friend_name: string; 
  friend_arroba: string;
  is_online?: boolean;
}