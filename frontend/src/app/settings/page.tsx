'use client';

import ProtectedRoute from "@/components/ProtectedRoute"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Bell, Moon, Shield } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [password, setPassword] = useState('');
  const { logout } = useAuth();
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const handleDeleteAccount = async () => {
    if (!password) {
      alert('Por favor, digite sua senha para confirmar.');
      return;
    }

    setIsDeleting(true);

    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        alert('Você precisa estar logado para excluir sua conta.');
        setIsDeleting(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/users/me/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: password,
        }),
      });

      if (response.status === 204 || response.ok) {
        // Conta excluída com sucesso
        alert('Sua conta foi excluída com sucesso.');

        // Limpa o localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');

        // Faz logout
        logout();

        // Redireciona para a página de login
        router.push('/auth/login');
      } else {
        // Tenta pegar o corpo da resposta
        let errorMessage = 'Erro desconhecido';
        try {
          const data = await response.json();
          console.log('Error response:', data);

          if (data.current_password) {
            errorMessage = data.current_password[0] || 'Senha incorreta';
          } else {
            errorMessage = data.detail || data.message || JSON.stringify(data);
          }
        } catch (e) {
          const text = await response.text();
          errorMessage = text || `HTTP ${response.status}`;
        }
        alert(`Erro ao excluir conta: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      alert(`Erro ao conectar com o servidor: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsDeleting(false);
      setPassword(''); // Limpa a senha
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto pt-24 px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Configurações</h1>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="h-5 w-5" /> Aparência
                </CardTitle>
                <CardDescription>Personalize a aparência da aplicação.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modo Escuro</Label>
                    <p className="text-sm text-muted-foreground">Alternar entre temas claro e escuro.</p>
                  </div>
                  <Switch disabled checked={false} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" /> Notificações
                </CardTitle>
                <CardDescription>Gerencie suas preferências de notificação.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações por Email</Label>
                    <p className="text-sm text-muted-foreground">Receba atualizações sobre seu progresso.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" /> Privacidade
                </CardTitle>
                <CardDescription>Gerencie suas configurações de privacidade.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Perfil Público</Label>
                    <p className="text-sm text-muted-foreground">Permitir que outros usuários vejam seu perfil.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="pt-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={isDeleting}>
                        {isDeleting ? 'Excluindo...' : 'Excluir Conta'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso irá excluir permanentemente sua conta
                          e remover todos os seus dados dos nossos servidores.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="py-4">
                        <Label htmlFor="password">Digite sua senha para confirmar</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Sua senha"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPassword('')}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Sim, excluir minha conta
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
