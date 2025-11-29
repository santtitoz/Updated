'use client';

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  PlayCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Trophy,
  Loader2,
  ArrowLeft,
  Clock,
  User
} from "lucide-react"

// --- TIPAGEM (Espelho da API /api/v1/trilhas/{id}/) ---

interface Atividade {
  id: number;
  title: string;
  type: 'video' | 'text' | 'quiz'; // Vem do models.py choices
  xp_reward: number;
  status: 'pending' | 'completed'; // Vem do serializer customizado
  video_url?: string;
  duration?: string;
}

interface Modulo {
  id: number;
  title: string;
  description: string;
  order: number;
  activities: Atividade[];
}

interface TrilhaDetail {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  duration: string;
  modules: Modulo[];
}

interface TrilhaViewProps {
  trilhaId: number;
  onBack: () => void;
}

export function TrilhaView({ trilhaId, onBack }: TrilhaViewProps) {
  const [trilha, setTrilha] = useState<TrilhaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [openModules, setOpenModules] = useState<number[]>([]);

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        // Chama a API passando o ID recebido
        const response = await fetch(`http://127.0.0.1:8000/api/v1/trilhas/${trilhaId}/`);
        
        if (!response.ok) throw new Error('Erro ao carregar');
        
        const data = await response.json();
        setTrilha(data);

        // Abre o primeiro módulo automaticamente se existir
        if (data.modules && data.modules.length > 0) {
          setOpenModules([data.modules[0].id]);
        }

      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setLoading(false);
      }
    }

    if (trilhaId) fetchDetail();
  }, [trilhaId]);

  // Função para abrir/fechar sanfona
  const toggleModule = (id: number) => {
    setOpenModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  // Ícone correto baseado no tipo (video/texto/quiz)
  const getIcon = (type: string) => {
    if (type === 'video') return <PlayCircle className="w-4 h-4 text-blue-400" />;
    if (type === 'quiz') return <Trophy className="w-4 h-4 text-yellow-500" />;
    return <FileText className="w-4 h-4 text-gray-400" />;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[500px] w-full bg-[#1a1a1a] rounded-[40px] text-white">
      <Loader2 className="w-10 h-10 animate-spin text-purple-500 mb-4" />
      <p>Carregando conteúdo...</p>
    </div>
  );

  if (!trilha) return null;

  return (
    <div className="w-full max-w-5xl mx-auto bg-[#1a1a1a] rounded-[40px] shadow-2xl overflow-hidden border border-white/5 relative min-h-screen md:min-h-[800px]">
      
      {/* Header da Trilha */}
      <div className="relative p-8 md:p-12 border-b border-white/10 bg-gradient-to-b from-purple-900/20 to-transparent">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 text-gray-400 hover:text-white hover:bg-white/10 p-0 h-auto gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> Voltar para trilhas
        </Button>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold uppercase border border-purple-500/30">
              {trilha.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" /> {trilha.duration}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            {trilha.title}
          </h1>
          
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <User className="w-4 h-4" />
            Instrutor: <span className="text-white">{trilha.author}</span>
          </div>

          <p className="text-gray-400 text-lg max-w-3xl mt-2 leading-relaxed">
            {trilha.description}
          </p>
        </div>
      </div>

      {/* Lista de Módulos (Accordion) */}
      <div className="p-6 md:p-12 flex flex-col gap-4">
        {trilha.modules.map((modulo, index) => {
          const isOpen = openModules.includes(modulo.id);

          return (
            <div 
              key={modulo.id} 
              className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                isOpen ? "bg-[#262626] border-purple-500/50" : "bg-[#202020] border-white/5"
              }`}
            >
              <button 
                onClick={() => toggleModule(modulo.id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isOpen ? "bg-purple-600 text-white" : "bg-white/10 text-gray-500"
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${isOpen ? "text-white" : "text-gray-300"}`}>
                      {modulo.title}
                    </h3>
                    {modulo.description && <p className="text-xs text-gray-500">{modulo.description}</p>}
                  </div>
                </div>
                <ChevronDown className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Lista de Aulas */}
              {isOpen && (
                <div className="border-t border-white/5 bg-black/20">
                  {modulo.activities.map((atv) => (
                    <div key={atv.id} className="flex items-center justify-between p-4 pl-16 hover:bg-white/5 border-b border-white/5 last:border-0 cursor-pointer group">
                      <div className="flex items-center gap-3">
                        {/* Ícone de Status */}
                        {atv.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-600 opacity-30 shrink-0 group-hover:border-purple-400 transition-colors" />
                        )}
                        
                        <div className="flex flex-col">
                          <span className={`text-sm font-medium ${atv.status === 'completed' ? "text-gray-500 line-through" : "text-gray-200"}`}>
                            {atv.title}
                          </span>
                          <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-1">
                            {getIcon(atv.type)}
                            <span>{atv.type === 'video' ? 'Vídeo' : atv.type === 'quiz' ? 'Quiz' : 'Leitura'}</span>
                            {atv.duration && <span>• {atv.duration}</span>}
                            <span className="text-purple-400 ml-2">+{atv.xp_reward} XP</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 text-xs h-8">
                        {atv.status === 'completed' ? 'Refazer' : 'Iniciar'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}