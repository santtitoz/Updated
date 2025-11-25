'use client';

import ProtectedRoute from "@/components/ProtectedRoute"
import { Header } from "@/components/header"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"

export default function MinhaContaPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto pt-24 px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Minha Conta</h1>

          <div className="grid gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl bg-primary/10">
                    {user?.username?.charAt(0).toUpperCase() || <User />}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{user?.username}</CardTitle>
                  <CardDescription>{user?.email}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                      <p className="text-sm font-medium text-muted-foreground">ID do Usuário</p>
                      <p className="text-lg font-semibold">{user?.id}</p>
                    </div>
                    <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-lg font-semibold">{user?.email}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
