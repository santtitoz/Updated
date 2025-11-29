// src/app/auth/layout.tsx
import { Header } from "@/components/header"; 

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* ⬅️ O Header é carregado aqui e aparece em /auth/login e /auth/register */}
      <Header /> 
      
      {/* O padding garante que o conteúdo não fique escondido sob o Header fixo */}
      <main className="pt-14"> 
        {children}
      </main>
    </div>
  );
}