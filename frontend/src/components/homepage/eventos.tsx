'use client';

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button" 
import { Calendar, MapPin, ArrowRight, Users, Loader2 } from "lucide-react"

// --- TIPAGEM (Baseada no seu Serializer) ---
interface EventoAPI {
  id: number;
  title: string;
  description: string;
  organization: string;
  start_datetime: string; // Vem como ISO string (ex: 2025-11-25T18:00:00Z)
  end_datetime: string;
  location: string;
  thumbnail: string | null; // Base64
  banner: string | null;    // Base64
  max_participants?: number;
}

export function EventosSection() {
  const [eventos, setEventos] = useState<EventoAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- BUSCAR DADOS ---
  useEffect(() => {
    async function fetchEventos() {
      try {
        // ATENÇÃO: A URL provável é /events/events/ devido ao router.register('events')
        const response = await fetch('http://127.0.0.1:8000/api/v1/events/events/');
        
        if (!response.ok) throw new Error('Erro ao conectar com API de Eventos');
        
        const data = await response.json();
        console.log("📅 DADOS EVENTOS:", data); // Debug no Console

        // Correção de Paginação (caso o DRF esteja paginando)
        const listaReal = Array.isArray(data) ? data : (data.results || []);
        setEventos(listaReal);

      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar os eventos.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEventos();
  }, []);

  // --- FORMATAÇÃO DE DATA ---
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    }).format(date).toUpperCase().replace('.', '');
  };

  // --- TRATAMENTO DE IMAGEM (Base64 ou Fallback) ---
  const getImageSrc = (base64String: string | null, fallbackType: 'banner' | 'thumb') => {
    if (base64String) {
      // Se já vier com "data:image...", usa direto. Se não, adiciona o prefixo.
      return base64String.startsWith('data:') 
        ? base64String 
        : `data:image/jpeg;base64,${base64String}`;
    }
    // Imagens de fallback caso não tenha nada no banco
    if (fallbackType === 'banner') return "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80";
    return "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80";
  };

  // Separa o destaque (primeiro evento) do resto da lista
  const featuredEvent = eventos[0];
  const eventList = eventos.slice(1, 4); // Pega os próximos 3

  return (
    <section className="w-full py-16 px-4 md:px-6 relative z-10">
      <div className="w-full max-w-7xl mx-auto">
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 flex items-center gap-3" style={{ fontFamily: "'Press Start 2P', cursive" }}>
          Eventos Universitários
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
            <Loader2 className="animate-spin" /> Carregando eventos...
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-10">{error}</div>
        ) : eventos.length === 0 ? (
          <div className="text-center text-gray-500 py-10">Nenhum evento programado no momento.</div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* --- EVENTO DESTAQUE (ESQUERDA) --- */}
            {featuredEvent && (
              <div className="flex-1 group cursor-pointer relative">
                <div className="relative h-[400px] w-full overflow-hidden rounded-[32px] border-2 border-black shadow-[8px_8px_0px_#000] transition-all duration-300 group-hover:translate-x-[-4px] group-hover:translate-y-[-4px] group-hover:shadow-[16px_16px_0px_#a855f7]">
                  <img 
                    src={getImageSrc(featuredEvent.banner || featuredEvent.thumbnail, 'banner')} 
                    alt={featuredEvent.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-bold uppercase mb-3">
                      Destaque
                    </div>
                    <h3 className="text-2xl md:text-4xl font-bold text-white mb-3 leading-tight group-hover:text-purple-300 transition-colors">
                      {featuredEvent.title}
                    </h3>
                    <p className="text-gray-300 text-sm line-clamp-2 mb-4 max-w-xl">
                      {featuredEvent.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-300 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        {formatDate(featuredEvent.start_datetime)}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-purple-400" />
                        {featuredEvent.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- LISTA LATERAL (DIREITA) --- */}
            <div className="lg:w-[400px] flex flex-col gap-5">
              {eventList.map((evt) => (
                <div 
                  key={evt.id} 
                  className="group/item flex gap-4 p-4 rounded-2xl bg-[#1a1a1a] border border-white/5 hover:bg-[#262626] hover:border-purple-500/30 transition-all cursor-pointer"
                >
                  {/* Thumbnail Quadrada */}
                  <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-800 relative">
                    <img 
                      src={getImageSrc(evt.thumbnail || evt.banner, 'thumb')} 
                      alt={evt.title} 
                      className="w-full h-full object-cover transition-transform group-hover/item:scale-110"
                    />
                  </div>

                  {/* Infos */}
                  <div className="flex flex-col justify-center">
                    <h4 className="text-white font-bold leading-tight mb-1 group-hover/item:text-purple-400 transition-colors line-clamp-2">
                      {evt.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <Calendar className="w-3 h-3" />
                      {formatDate(evt.start_datetime)}
                    </div>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {evt.location}
                    </span>
                  </div>
                </div>
              ))}

              {/* Botão Ver Mais */}
              <Button variant="outline" className="w-full mt-auto rounded-xl border-white/10 text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20 h-12">
                Ver agenda completa <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

          </div>
        )}
      </div>
    </section>
  )
}