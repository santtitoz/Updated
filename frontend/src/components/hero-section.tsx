// src/components/hero-section.tsx
'use client';

import { Mail, CodeXml, AppWindow, Zap, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/use-auth';

export function HeroSection() {
  const { isAuthenticated, user } = useAuth();

  const stats = [
    { value: "30k+", label: "Estudantes", color: "bg-gradient-to-br from-blue-400 to-cyan-500" },
    { value: "200+", label: "Desafios", color: "bg-gradient-to-br from-purple-400 to-purple-600" },
    { value: "18+", label: "Cursos", color: "bg-gradient-to-br from-green-400 to-emerald-600" },
  ];

  const features = [
    { name: "Sistema de Streaks", color: "bg-gradient-to-r from-orange-400 to-orange-600" },
    { name: "Rankings Globais", color: "bg-gradient-to-r from-yellow-300 to-yellow-400" },
    { name: "Rankings Globais", color: "bg-gradient-to-r from-blue-400 to-cyan-500" },
    { name: "Conquistas & Badges", color: "bg-gradient-to-r from-purple-400 to-purple-600" },
    { name: "Comunidade Ativa", color: "bg-gradient-to-r from-green-400 to-emerald-600" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pb-12 font-pixel">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
        <div className="relative mx-auto max-w-4xl flex flex-col items-center text-center">
          {/* --- Ícones decorativos --- */}
          <div className="absolute left-[-5%] top-[15%] hidden md:block animate-float">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#60a5fa]/80 shadow-lg">
              <CodeXml className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="absolute left-[2%] bottom-[10%] hidden md:block animate-float-delayed">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#c084fc]/80 shadow-lg">
              <AppWindow className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="absolute right-[8%] top-[15%] hidden md:block animate-float-delayed-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fbbf24]/80 shadow-lg">
              <Zap className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="absolute right-[5%] top-[50%] hidden md:block animate-float">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4ade80]/80 shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="absolute right-[3%] bottom-[20%] hidden md:block animate-float-delayed">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fb923c]/80 shadow-lg">
              <Trophy className="h-7 w-7 text-white" />
            </div>
          </div>

          {/* --- Greeting Card --- */}
          <div className="mb-8 flex w-full justify-start md:pl-0">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2a2a2a] shadow-md">
                <Mail className="h-7 w-7 text-white" />
              </div>
              <div className="rounded-2xl bg-[#2a2a2a] px-8 py-4 shadow-md">
                {isAuthenticated ? (
                  <>
                    <p className="text-lg font-medium text-white">Bem vindo {user?.username || user?.email}!</p>
                    {/* <p className="text-sm text-white/80">Pronto para continuar sua jornada?</p> */}
                  </>
                ) : (
                  <p className="text-lg font-medium text-white">Olá Dev! Está Pronto Para Começar?</p>
                )}
              </div>
            </div>
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-tight text-balance md:text-6xl lg:text-7xl text-[#1a1a1a]">
            Aprenda a Programar <br /> de Forma{' '}
            <span
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x"
              style={{ backgroundSize: "200% 200%" }}
            >
              Gamificada
            </span>
          </h1>

          <p className="mb-10 text-base font-sans text-[#4a4a4a] text-pretty md:text-lg max-w-3xl mx-auto leading-relaxed">
            Domine linguagens de programação através de desafios, conquiste ranks, ganhe XP e compartilhe seus projetos
            com uma comunidade global de desenvolvedores.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row mb-12">
            <Button
              size="lg"
              className="bg-black hover:bg-black/90 text-white rounded-xl px-8 h-14 text-lg font-bold button-gradient-border"
            >
              Começar Agora
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl px-8 h-14 bg-white border-2 border-black text-black hover:bg-gray-50 hover:text-black text-lg font-bold button-gradient-border"
            >
              Ver Cursos
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`${stat.color} text-white rounded-xl px-5 py-3 flex flex-row items-baseline justify-center gap-1.5 shadow-md`}
              >
                <span className="text-lg font-bold">{stat.value}</span>
                <span className="text-sm font-medium">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-nowrap items-center justify-center gap-2 overflow-x-auto pb-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${feature.color} text-white rounded-full px-4 py-2 text-xs font-medium shadow-sm whitespace-nowrap flex-shrink-0`}
              >
                {feature.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
