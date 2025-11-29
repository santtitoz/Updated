import { Header } from "@/components/header"
import { IniciarCurso } from "@/components/homepage/iniciar-curso"
import { TrilhasSection } from "@/components/homepage/trilha"
import { EventosSection } from "@/components/homepage/eventos"
import { Footer } from "@/components/footer"

export default function HomePage() {
  
  // --- AJUSTE DE QUANTIDADE ---
  const quantity = 20; // Reduzido para 20 (Fica mais limpo)
  
  const colors = [
    'bg-purple-400', 'bg-blue-400', 'bg-green-300', 
    'bg-yellow-300', 'bg-pink-400', 'bg-red-300', 
    'bg-cyan-300', 'bg-orange-300'
  ];

  // Gera as bolinhas
  const blobs = Array.from({ length: quantity }).map((_, i) => {
    // Mantendo o tamanho pequeno que você gostou (50px a 150px)
    const size = Math.floor(Math.random() * 100) + 50; 
    
    return {
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      style: {
        width: `${size}px`,
        height: `${size}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`, 
        animationDuration: `${Math.random() * 10 + 5}s`,
      }
    };
  });

  return (
    <div className="min-h-screen bg-white relative overflow-hidden selection:bg-purple-200">
      
      {/* --- CAMADA DE FUNDO --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {blobs.map((blob) => (
          <div
            key={blob.id}
            // blur-xl para suavizar bem, opacity-40 para não brigar com o texto
            className={`absolute rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob ${blob.color}`}
            style={blob.style}
          ></div>
        ))}
      </div>

      {/* CONTEÚDO (Por cima) */}
      <div className="relative z-10">
        <Header />
        
        <main className="pt-14">
          <IniciarCurso />
          <TrilhasSection />
          <EventosSection />
        </main>
        
        <Footer />
      </div>
      
    </div>
  )
}