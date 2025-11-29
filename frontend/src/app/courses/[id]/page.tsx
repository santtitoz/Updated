'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Loader2, CheckCircle, Lock, PlayCircle, FileText, HelpCircle, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface Atividade {
  id: number;
  title: string;
  description: string;
  content: string;
  order: number;
  xp_reward: number;
  status: 'pending' | 'completed';
  completed_at: string | null;
  type: 'video' | 'text' | 'quiz';
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
  image: string | null;
  author: string;
  duration: string;
  modules: Modulo[];
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [trilha, setTrilha] = useState<TrilhaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<number | null>(null);

  useEffect(() => {
    async function loadTrilha() {
      try {
        const id = params.id as string;
        const data = await api.getTrilha(id);
        setTrilha(data);
      } catch (error) {
        console.error("Erro ao carregar trilha:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os detalhes do curso.",
        });
        router.push("/courses");
      } finally {
        setLoading(false);
      }
    }
    loadTrilha();
  }, [params.id, router, toast]);

  const handleCompleteActivity = async (activityId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent accordion toggle if button is inside trigger (it's not, but good practice)
    setCompletingId(activityId);
    try {
      await api.completeActivity(activityId);

      // Update local state to reflect completion
      setTrilha(prev => {
        if (!prev) return null;
        const newModules = prev.modules.map(mod => ({
          ...mod,
          activities: mod.activities.map(act =>
            act.id === activityId ? { ...act, status: 'completed' as const, completed_at: new Date().toISOString() } : act
          )
        }));
        return { ...prev, modules: newModules };
      });

      toast({
        title: "Atividade Concluída!",
        description: "Você ganhou XP por completar esta atividade.",
        className: "bg-green-50 border-green-200 text-green-800"
      });
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Erro ao completar atividade.";
      toast({
        variant: "destructive",
        title: "Atenção",
        description: msg,
      });
    } finally {
      setCompletingId(null);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle className="w-5 h-5" />;
      case 'quiz': return <HelpCircle className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!trilha) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 flex flex-col font-sans">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-10 max-w-5xl mt-16">
        <Button
          variant="ghost"
          className="mb-6 pl-0 hover:bg-transparent hover:text-purple-600"
          onClick={() => router.push("/courses")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Cursos
        </Button>

        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="h-48 bg-gradient-to-r from-purple-600 to-indigo-600 relative">
            {trilha.image && (
              <div className="absolute inset-0 bg-black/20">
                <img src={trilha.image} alt={trilha.title} className="w-full h-full object-cover mix-blend-overlay opacity-50" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3 inline-block border border-white/30">
                {trilha.category}
              </span>
              <h1 className="text-4xl font-bold mb-2">{trilha.title}</h1>
              <p className="text-white/90 max-w-2xl">{trilha.description}</p>
            </div>
          </div>
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex gap-6 text-sm text-gray-600">
            <span><strong>Autor:</strong> {trilha.author}</span>
            <span><strong>Duração:</strong> {trilha.duration}</span>
            <span><strong>Módulos:</strong> {trilha.modules.length}</span>
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Conteúdo do Curso</h2>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {trilha.modules.map((modulo, index) => (
              <AccordionItem key={modulo.id} value={`item-${modulo.id}`} className="bg-white border border-gray-200 rounded-xl px-4 shadow-sm">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-4 text-left">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Módulo {index + 1}</span>
                      <span className="text-lg font-medium text-gray-900">{modulo.title}</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-6">
                  <p className="text-gray-500 mb-4 text-sm">{modulo.description}</p>

                  <div className="space-y-3">
                    {modulo.activities.map((activity) => (
                      <div
                        key={activity.id}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-lg border transition-all",
                          activity.status === 'completed'
                            ? "bg-green-50 border-green-100"
                            : "bg-gray-50 border-gray-100 hover:border-purple-200"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "p-2 rounded-full",
                            activity.status === 'completed' ? "bg-green-100 text-green-600" : "bg-white text-gray-400"
                          )}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div>
                            <h4 className={cn(
                              "font-medium",
                              activity.status === 'completed' ? "text-green-900" : "text-gray-900"
                            )}>
                              {activity.title}
                            </h4>
                            <p className="text-xs text-gray-500">{activity.description}</p>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant={activity.status === 'completed' ? "ghost" : "default"}
                          disabled={activity.status === 'completed' || completingId === activity.id}
                          onClick={(e) => activity.status !== 'completed' && handleCompleteActivity(activity.id, e)}
                          className={cn(
                            activity.status === 'completed'
                              ? "text-green-600 hover:text-green-700 hover:bg-green-100"
                              : "bg-purple-600 hover:bg-purple-700 text-white"
                          )}
                        >
                          {completingId === activity.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : activity.status === 'completed' ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" /> Concluído
                            </>
                          ) : (
                            "Concluir"
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
}
