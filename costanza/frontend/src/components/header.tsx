// src/components/header.tsx
'use client';

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Menu, LogOut, User, Settings, BookOpen, Trophy, Award, HelpCircle, LayoutDashboard } from "lucide-react"
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  // Pega a primeira letra do username ou email para o avatar
  const getInitial = () => {
    if (user?.username) return user.username[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return 'U';
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-[#1a1a1a] border-b border-border/40">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6 lg:px-8 max-w-6xl">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">Costanza</span>
        </Link>

        {/* <nav className="hidden items-center gap-8 md:flex">
          {isAuthenticated && (
            <>
              <Link href="/minha-conta" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
                Minha Conta
              </Link>
              <Link href="/settings" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
                Configurações
              </Link>
            </>
          )}
        </nav> */}

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Search className="h-5 w-5" />
          </Button>

          {/* Menu Dropdown - Apenas quando logado */}
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                  aria-label="Abrir menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[280px] bg-[#1a1a1a] border-white/10 text-white"
              >
                {/* Informações do Usuário */}
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center gap-3 py-2">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-purple-600 text-white font-semibold">
                        {getInitial()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-white">{user?.username || 'Usuário'}</p>
                      <p className="text-xs text-white/60">{user?.email}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-white/10" />

                {/* Navegação Principal */}
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                  <Link href="/" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard Pessoal</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                  <Link href="/cursos" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Página de Cursos</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                  <Link href="/classificacao" className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    <span>Classificação</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                  <Link href="/conquistas" className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span>Conquistas</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-white/10" />

                {/* Configurações e Conta */}
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                  <Link href="/minha-conta" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Minha Conta</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                  <Link href="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Configurações</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                  <Link href="/ajuda" className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    <span>Ajuda / Suporte</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-white/10" />

                {/* Botão Sair */}
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer hover:bg-red-600/20 focus:bg-red-600/20 text-red-400"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Botão de Login quando NÃO logado */}
          {!isAuthenticated && (
            <Link href="/auth/login" passHref>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}