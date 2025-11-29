'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Loader2, BookOpen, Clock, User, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Trilha {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string | null;
  author: string;
  duration: string;
  modules_count: number;
}

export default function CoursesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrilhas() {
      try {
        const data = await api.getTrilhas();
        const list = Array.isArray(data) ? data : data.results || [];
        setTrilhas(list);
      } catch (error) {
        console.error("Erro ao carregar trilhas:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os cursos.",
        });
      } finally {
        setLoading(false);
      }
    }
    loadTrilhas();
  }, [toast]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 flex flex-col font-sans">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-10 max-w-6xl mt-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Cursos Disponíveis</h1>
          <p className="text-gray-500">Explore nossas trilhas de conhecimento e evolua sua carreira.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
          </div>
        ) : trilhas.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Nenhum curso encontrado</h3>
            <p className="text-gray-500">Volte mais tarde para conferir novidades.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trilhas.map((trilha) => (
              <div
                key={trilha.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
                onClick={() => router.push(`/courses/${trilha.id}`)}
              >
                {/* Cover Image */}
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  {trilha.image ? (
                    <img
                      src={trilha.image}
                      alt={trilha.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-purple-300" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-purple-700 shadow-sm">
                      {trilha.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {trilha.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
                    {trilha.description || "Sem descrição disponível."}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-6">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {trilha.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {trilha.modules_count} Módulos
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {trilha.author}
                    </div>
                  </div>

                  <Button className="w-full bg-gray-50 text-purple-600 hover:bg-purple-50 hover:text-purple-700 border border-gray-100 group-hover:border-purple-100 transition-all">
                    Ver Detalhes <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
