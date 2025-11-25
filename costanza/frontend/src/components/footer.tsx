import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Instagram, Github, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-gradient-x" />

      <div className="py-10">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5 mb-12">
            <div className="lg:col-span-1">
              <div className="mb-4">
                <span className="text-2xl font-bold">Costanza</span>
              </div>
              <p className="text-sm text-white/70 mb-6">
                A plataforma gamificada para aprender programação de forma divertida
              </p>
              <div className="flex gap-3">
                <Button size="icon" variant="ghost" className="hover:bg-white/10 rounded-lg">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost" className="hover:bg-white/10 rounded-lg">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.077.077 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </Button>
                <Button size="icon" variant="ghost" className="hover:bg-white/10 rounded-lg">
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost" className="hover:bg-white/10 rounded-lg">
                  <Github className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Plataforma</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Cursos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Desafios
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Projetos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Comunidade
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Documentação
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Tutoriais
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Sobre
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Carreiras
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contato
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Parceiros
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Central de Ajuda
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Termos
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mb-12" />

          <div className="mb-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Receba novidades e dicas</h3>
              <p className="text-sm text-white/70 mb-6">
                Inscreva-se para receber atualizações sobre novos cursos e funcionalidades
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Button className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 px-8 whitespace-nowrap bg-[length:200%_100%] animate-gradient-x">
                  Inscrever
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/70">
              <p>© 2025 Costanza. Feito por desenvolvedores aptos a desenvolver.</p>
              <p>• Todos os direitos reservados</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
