// src/components/homepage/iniciar-curso.tsx
'use client';

import { Button } from "@/components/ui/button" // Ou use um <button> padrão com classes se não tiver o componente UI
import { ArrowRight, Sparkles } from "lucide-react"

export function IniciarCurso() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 flex flex-col md:flex-row items-center gap-10 md:gap-16">
      
      {/* --- Lado Esquerdo: Conteúdo de Boas-vindas --- */}
      <div className="flex-1 space-y-6 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Bem-vindo ao Costanza</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.15]">
          Dê o primeiro passo para o seu <br className="hidden lg:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            futuro tech
          </span>
        </h1>
        
        <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto md:mx-0">
          Você chegou ao lugar certo. O Costanza é a plataforma que transforma curiosidade em código. 
          Explore nossas trilhas, escolha sua tecnologia favorita e comece a construir projetos reais hoje mesmo.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
          <Button className="h-12 px-8 rounded-full bg-black hover:bg-black/80 text-white font-semibold text-base transition-transform hover:scale-105 shadow-lg shadow-purple-500/20">
            Explorar todos os cursos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <span className="text-sm text-gray-500 font-medium">
            Gratuito para começar
          </span>
        </div>
      </div>

{/* --- Lado Direito: Grid de Imagens --- */}
      <div className="flex-1 w-full h-[400px] md:h-[500px] flex gap-4">
        
        {/* Coluna Alta (Esquerda) - JÁ ESTAVA CERTO */}
        <div className="flex-1 h-full rounded-[32px] overflow-hidden shadow-2xl transition-transform hover:-translate-y-2 duration-300 border-2 border-white">
          <img 
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop" 
            alt="Ambiente de desenvolvimento" 
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
          />
        </div>
        
        {/* Coluna Empilhada (Direita) */}
        <div className="flex-1 flex flex-col gap-4 h-full pt-8">
          
          {/* Imagem Superior - CORRIGIDO */}
          {/* Adicionei: transition-transform hover:-translate-y-2 duration-300 na DIV */}
          <div className="flex-1 rounded-[24px] overflow-hidden shadow-xl border-2 border-white transition-transform hover:-translate-y-2 duration-300">
            <img 
              src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop" 
              alt="Código na tela" 
              // Mantive o zoom interno na imagem
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
            />
          </div>
          
          {/* Imagem Inferior - CORRIGIDO */}
          {/* Adicionei: transition-transform hover:-translate-y-2 duration-300 na DIV */}
          <div className="flex-1 rounded-[24px] overflow-hidden shadow-xl border-2 border-white bg-gray-100 flex items-center justify-center relative transition-transform hover:-translate-y-2 duration-300">
             <img 
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop" 
              alt="Setup Laptop" 
              // Mantive o zoom interno na imagem
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
            />
             <div className="absolute inset-0 bg-purple-900/10 mix-blend-overlay"></div>
          </div>
          
        </div>
      </div>

    </section>
  )
}