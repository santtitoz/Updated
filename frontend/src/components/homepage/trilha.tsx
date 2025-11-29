'use client';

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button" 
import { Clock, BookOpen, User, ArrowRight, Loader2 } from "lucide-react"
// Importe o componente de detalhes
import { TrilhaView } from "./trilha-view" 

// --- TIPAGEM REAL (Espelho do seu Serializer Django) ---
interface TrilhaAPI {
  id: number;
  title: string;
  slug: string;
  description: string;
  // Campos opcionais (pois podem vir null do banco)
  category?: string;   
  author?: string | null; 
  duration?: string;
  image?: string | null; 
  modules_count?: number;
}

// Interface para uso interno do componente (Garante que não teremos null na tela)
interface TrilhaDisplay extends TrilhaAPI {
  category: string;
  author: string;
  duration: string;
  image: string;
  modulesCount: number;
}

const TABS = ["Todos", "Fundamentos", "Front-end", "Back-end", "DevOps"];

// Imagens de Fallback (caso a trilha não tenha imagem no banco)
const CARD_IMAGES = [
  "https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=500&q=80", 
  "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=500&q=80", 
  "https://images.unsplash.com/photo-1607799275518-d58665d096b1?w=500&q=80", 
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&q=80", 
  "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500&q=80", 
  "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=500&q=80"  
];

const CATEGORIES_POOL = ["Fundamentos", "Front-end", "Back-end", "DevOps"];

export function TrilhasSection() {
  const [activeTab, setActiveTab] = useState("Todos");
  const [trilhas, setTrilhas] = useState<TrilhaDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // ESTADO NOVO: Controla se estamos vendo a lista ou o detalhe de um curso
  const [selectedTrilhaId, setSelectedTrilhaId] = useState<number | null>(null);

  // --- BUSCAR DADOS DA API ---
  useEffect(() => {
    async function fetchTrilhas() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/trilhas/'); 
        
        if (!response.ok) {
          throw new Error('Falha ao conectar com a API');
        }

        const data = await response.json();
        console.log("🔥 DADOS VINDOS DA API:", data); 

        // 1. Tratamento de Paginação (DRF retorna { results: [] } ou [])
        let listaCrua = [];
        if (Array.isArray(data)) {
          listaCrua = data;
        } else if (data.results && Array.isArray(data.results)) {
          listaCrua = data.results;
        } else {
          console.warn("Formato de dados inesperado. Verifique o router do Django.");
          listaCrua = []; 
        }

        // 2. Adaptador Inteligente (Usa dado real, se não tiver, usa mock)
        const trilhasAdaptadas: TrilhaDisplay[] = listaCrua.map((item: any, index: number) => ({
          ...item,
          description: item.description || "Aprofunde seus conhecimentos nesta trilha essencial.",
          
          // Prioriza o dado do banco. Se for null/vazio, usa fallback
          category: item.category || CATEGORIES_POOL[index % CATEGORIES_POOL.length], 
          image: item.image || CARD_IMAGES[index % CARD_IMAGES.length],
          author: item.author || "Equipe Costanza",
          duration: item.duration || "0h 00m",
          modulesCount: item.modules_count || 0,
        }));

        setTrilhas(trilhasAdaptadas);
      } catch (err) {
        console.error("Erro no fetch:", err);
        setError("Não foi possível carregar as trilhas.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrilhas();
  }, []);

  // Filtro das abas
  const filteredTrilhas = trilhas.filter(trilha => {
    if (activeTab === "Todos") return true;
    // Comparação segura (case insensitive)
    return trilha.category?.toLowerCase() === activeTab.toLowerCase();
  }).slice(0, 4);

  // Corrige URL de imagem relativa (/media/...)
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "";
    if (imagePath.startsWith('http')) return imagePath;
    return `http://127.0.0.1:8000${imagePath}`;
  };

  // --- RENDERIZAÇÃO CONDICIONAL ---
  
  // 1. Se tem um ID selecionado, mostra o COMPONENTE DE DETALHES
  if (selectedTrilhaId !== null) {
    return (
      <section className="w-full py-10 px-4 relative z-10">
        <TrilhaView 
          trilhaId={selectedTrilhaId} 
          onBack={() => setSelectedTrilhaId(null)} // Botão voltar limpa o ID
        />
      </section>
    );
  }

  // 2. Se não tem ID, mostra a LISTA DE CARDS
  return (
    <section className="w-full py-16 px-4 md:px-6 relative z-10">
      <div className="w-full max-w-7xl mx-auto bg-[#1a1a1a] rounded-[40px] shadow-2xl p-6 md:p-12 flex flex-col items-center border border-white/5 relative overflow-hidden min-h-[500px]">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 self-start flex items-center gap-3">
          <BookOpen className="text-purple-500" /> Todas as trilhas
        </h2>

        {/* Abas */}
        <div className="w-full flex flex-wrap gap-4 md:gap-8 border-b border-white/10 mb-10 pb-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm md:text-base font-medium pb-3 transition-all relative ${
                activeTab === tab ? "text-white" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab}
              {activeTab === tab && <span className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-purple-500 rounded-t-full shadow-[0_-2px_10px_rgba(168,85,247,0.5)]" />}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            <p>Carregando conhecimentos...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-red-400 text-center">
            <p>{error}</p>
            <Button variant="link" className="text-white mt-2" onClick={() => window.location.reload()}>Tentar novamente</Button>
          </div>
        ) : filteredTrilhas.length === 0 ? (
          <div className="py-20 text-gray-500 text-center"><p>Nenhuma trilha encontrada nesta categoria.</p></div>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {filteredTrilhas.map((trilha) => (
              <div 
                key={trilha.id} 
                onClick={() => setSelectedTrilhaId(trilha.id)} // <--- AÇÃO DE CLIQUE
                className="group bg-[#262626] border border-[#333] rounded-2xl overflow-hidden hover:border-purple-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full shadow-lg"
              >
                <div className="h-40 overflow-hidden bg-gray-800 relative">
                  <img src={getImageUrl(trilha.image)} alt={trilha.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                    {trilha.category}
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 group-hover:text-purple-400 transition-colors">{trilha.title}</h3>
                  <p className="text-gray-400 text-xs line-clamp-2 min-h-[2.5em]">{trilha.description}</p>
                  <div className="mt-auto flex items-center justify-between text-gray-500 text-xs pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2"><User className="w-3 h-3" /><span>{trilha.author}</span></div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1"><BookOpen className="w-3 h-3" /><span>{trilha.modulesCount} mod.</span></div>
                      <div className="flex items-center gap-1"><Clock className="w-3 h-3" /><span>{trilha.duration}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button variant="secondary" className="bg-white text-black hover:bg-gray-200 rounded-full px-8 py-6 font-bold text-base transition-transform hover:scale-105">
          Ver todos os cursos <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </section>
  )
}