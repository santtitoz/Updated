'use client';

import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Header } from "@/components/header"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  User,
  Trophy,
  BookOpen,
  Calendar,
  Code,
  Activity,
  Edit,
  MapPin,
  Link as LinkIcon,
  Mail,
  Loader2,
  Users,
  UserPlus,
  Award,
  Star,
  Zap,
  Target,
  Medal,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

interface ProfileData {
  id: number
  user: number
  nome: string
  arroba: string
  stack: string
  bio: string
  skills: string
  xp: number
  exercicios_concluidos: number
  trilhas_concluidas: number
  dias_conectados: number
}

interface Friend {
  id: number
  created_at: string
  friend: {
    id: number
    username: string
    email: string
  }
}

interface FriendRequest {
  id: number
  from_user: {
    id: number
    username: string
    email: string
  }
  to_user: number
  created_at: string
}

export default function MinhaContaPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Friends State
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    nome: "",
    arroba: "",
    stack: "",
    bio: "",
    skills: ""
  });

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await api.getProfile();
        setProfile(data);
        setFormData({
          nome: data.nome || "",
          arroba: data.arroba || "",
          stack: data.stack || "",
          bio: data.bio || "",
          skills: data.skills || ""
        });
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadProfile();
    }
  }, [user]);

  // Load friends when tab changes or on mount
  const loadFriendsData = async () => {
    setLoadingFriends(true);
    try {
      const [friendsList, requestsList] = await Promise.all([
        api.getFriends(),
        api.getFriendRequests()
      ]);
      setFriends(friendsList);
      setRequests(requestsList);
    } catch (error) {
      console.error("Erro ao carregar amigos:", error);
    } finally {
      setLoadingFriends(false);
    }
  };

  const handleSearchUsers = async (queryOverride?: string) => {
    const query = queryOverride !== undefined ? queryOverride : searchQuery;
    // Allow empty query to fetch suggestions (all users/recent users)

    setSearching(true);
    try {
      const data = await api.searchUsers(query);
      // Handle both array (no pagination) and object (pagination) responses
      const users = Array.isArray(data) ? data : data.results || [];

      // Filter out self and already friends
      const friendIds = new Set(friends.map(f => f.friend.id));
      const filtered = users.filter((u: any) => u.id !== user?.id && !friendIds.has(u.id));
      setSearchResults(filtered);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      toast({ title: "Erro", description: "Falha ao buscar usuários.", variant: "destructive" });
    } finally {
      setSearching(false);
    }
  };

  const handleSendFriendRequest = async (toUserId: number) => {
    try {
      await api.sendFriendRequest(toUserId);
      toast({ title: "Solicitação enviada!", description: "Aguarde a aprovação." });
      setSearchResults(prev => prev.filter(u => u.id !== toUserId)); // Remove from list
      loadFriendsData(); // Refresh requests if needed
    } catch (error: any) {
      console.error("Erro ao enviar solicitação:", error);
      const errorMessage = error.response?.data?.detail || error.message || "Não foi possível enviar a solicitação.";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const updatedProfile = await api.updateProfile(formData);
      setProfile(updatedProfile);
      setIsEditing(false);
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível salvar as alterações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAcceptRequest = async (id: number) => {
    try {
      await api.acceptFriendRequest(id);
      toast({ title: "Solicitação aceita!", description: "Vocês agora são amigos." });
      loadFriendsData();
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível aceitar a solicitação.", variant: "destructive" });
    }
  };

  const handleRejectRequest = async (id: number) => {
    try {
      await api.rejectFriendRequest(id);
      toast({ title: "Solicitação removida", description: "A solicitação foi rejeitada." });
      loadFriendsData();
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível rejeitar a solicitação.", variant: "destructive" });
    }
  };

  const handleRemoveFriend = async (userId: number) => {
    try {
      await api.removeFriend(userId);
      toast({ title: "Amigo removido", description: "A amizade foi desfeita." });
      loadFriendsData();
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível remover o amigo.", variant: "destructive" });
    }
  };

  // Mock Achievements based on Profile Data
  const achievements = [
    {
      id: 1,
      title: "Primeiros Passos",
      description: "Crie sua conta e complete o perfil.",
      icon: <User className="h-6 w-6 text-blue-500" />,
      unlocked: !!profile?.nome && !!profile?.bio,
    },
    {
      id: 2,
      title: "Estudante Dedicado",
      description: "Complete 5 exercícios.",
      icon: <BookOpen className="h-6 w-6 text-green-500" />,
      unlocked: (profile?.exercicios_concluidos || 0) >= 5,
    },
    {
      id: 3,
      title: "Mestre do XP",
      description: "Alcance 1000 de XP.",
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      unlocked: (profile?.xp || 0) >= 1000,
    },
    {
      id: 4,
      title: "Trilheiro",
      description: "Complete sua primeira trilha.",
      icon: <MapPin className="h-6 w-6 text-purple-500" />,
      unlocked: (profile?.trilhas_concluidas || 0) >= 1,
    },
    {
      id: 5,
      title: "Social",
      description: "Tenha pelo menos 1 amigo.",
      icon: <Users className="h-6 w-6 text-pink-500" />,
      unlocked: friends.length > 0,
    }
  ];

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <Header />
          <div className="h-48 bg-muted animate-pulse" />
          <div className="container mx-auto px-4 -mt-20">
            <div className="flex flex-col gap-6">
              <div className="h-32 w-32 rounded-full bg-muted-foreground/20 animate-pulse border-4 border-background" />
              <div className="space-y-2">
                <div className="h-8 w-64 bg-muted animate-pulse rounded" />
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-12">
        <Header />

        {/* Banner Section */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button variant="secondary" size="sm" className="opacity-90 hover:opacity-100">
              <Users className="mr-2 h-4 w-4" />
              Convidar Amigos
            </Button>
          </div>
        </div>

        <main className="container mx-auto px-4 -mt-24 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar / Profile Info */}
            <div className="flex flex-col gap-6 lg:w-1/3">
              <div className="bg-card rounded-xl shadow-lg border p-6 flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl -mt-20 mb-4">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                    {user?.username?.charAt(0).toUpperCase() || <User className="h-12 w-12" />}
                  </AvatarFallback>
                </Avatar>

                <h1 className="text-2xl font-bold">{profile?.nome || user?.username}</h1>
                <p className="text-muted-foreground font-medium">@{profile?.arroba || user?.username}</p>

                {profile?.stack && (
                  <Badge variant="secondary" className="mt-3 px-4 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20">
                    {profile.stack}
                  </Badge>
                )}

                <p className="mt-6 text-muted-foreground text-sm leading-relaxed">
                  {profile?.bio || "Olá! Sou novo por aqui e estou pronto para aprender."}
                </p>

                <div className="w-full mt-6 pt-6 border-t grid gap-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Membro desde {new Date().getFullYear()}</span>
                  </div>
                </div>

                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                  <DialogTrigger asChild>
                    <Button className="w-full mt-6" variant="outline">
                      <Edit className="mr-2 h-4 w-4" />
                      Editar Perfil
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Editar Perfil</DialogTitle>
                      <DialogDescription>
                        Faça alterações em seu perfil aqui. Clique em salvar quando terminar.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="nome">Nome</Label>
                        <Input
                          id="nome"
                          name="nome"
                          value={formData.nome}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="arroba">Usuário (@)</Label>
                        <Input
                          id="arroba"
                          name="arroba"
                          value={formData.arroba}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="stack">Stack / Cargo</Label>
                        <Input
                          id="stack"
                          name="stack"
                          placeholder="Ex: Fullstack Developer"
                          value={formData.stack}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="skills">Skills (separadas por vírgula)</Label>
                        <Input
                          id="skills"
                          name="skills"
                          placeholder="React, Node.js, Python..."
                          value={formData.skills}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="bio">Biografia</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          placeholder="Conte um pouco sobre você..."
                          value={formData.bio}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
                      <Button onClick={handleSaveProfile} disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Salvar Alterações
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Skills Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Code className="h-5 w-5 text-primary" />
                    Skills & Tecnologias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile?.skills ? (
                      profile.skills.split(',').map((skill, index) => (
                        <Badge key={index} variant="outline" className="px-3 py-1 hover:bg-primary/5 transition-colors cursor-default">
                          {skill.trim()}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">Nenhuma skill registrada.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content / Tabs */}
            <div className="flex-1">
              <Tabs defaultValue="overview" className="w-full" onValueChange={(val: string) => val === 'friends' && loadFriendsData()}>
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                  <TabsTrigger value="friends">Amigos</TabsTrigger>
                  <TabsTrigger value="achievements">Conquistas</TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="flex flex-col gap-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                        <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                          <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{profile?.xp || 0}</p>
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">XP Total</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
                          <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{profile?.exercicios_concluidos || 0}</p>
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Exercícios</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                        <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                          <Activity className="h-6 w-6 text-green-600 dark:text-green-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{profile?.trilhas_concluidas || 0}</p>
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Trilhas</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                        <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
                          <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{profile?.dias_conectados || 0}</p>
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Dias Seguidos</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity */}
                  <Card className="flex-1">
                    <CardHeader>
                      <CardTitle className="text-xl">Atividade Recente</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                        <Activity className="h-12 w-12 mb-4 opacity-20" />
                        <p className="text-lg font-medium">Nenhuma atividade recente</p>
                        <p className="text-sm">Complete exercícios para ver seu progresso aqui.</p>
                        <Button variant="link" className="mt-2 text-primary">
                          Ir para Cursos
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* FRIENDS TAB */}
                <TabsContent value="friends" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Seus Amigos</h2>
                    <Dialog onOpenChange={(open) => {
                      if (open) {
                        setSearchQuery("");
                        handleSearchUsers(""); // Load suggestions (empty query)
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Adicionar Amigo
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Adicionar Amigo</DialogTitle>
                          <DialogDescription>
                            Busque por usuários ou veja sugestões de quem seguir.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Buscar usuário..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearchUsers()}
                            />
                            <Button onClick={() => handleSearchUsers()} disabled={searching}>
                              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}
                            </Button>
                          </div>

                          <div className="space-y-2 max-h-[200px] overflow-y-auto">
                            {!searchQuery && searchResults.length > 0 && (
                              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Sugestões para você</p>
                            )}

                            {searchResults.map(user => (
                              <div key={user.id} className="flex items-center justify-between p-2 border rounded hover:bg-muted/50">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>{(user.nome || user.username).charAt(0).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div className="text-sm">
                                    <p className="font-medium">{user.nome || user.username}</p>
                                    <p className="text-xs text-muted-foreground">@{user.arroba || user.username}</p>
                                  </div>
                                </div>
                                <Button size="sm" variant="secondary" onClick={() => handleSendFriendRequest(user.id)}>
                                  Adicionar
                                </Button>
                              </div>
                            ))}

                            {searchResults.length === 0 && !searching && (
                              <div className="text-center py-4">
                                <p className="text-sm text-muted-foreground">
                                  {searchQuery ? `Nenhum usuário encontrado para "${searchQuery}".` : "Nenhuma sugestão disponível no momento."}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {loadingFriends ? (
                    <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                  ) : (
                    <>
                      {/* Requests Section */}
                      {requests.length > 0 && (
                        <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-yellow-800 dark:text-yellow-400">
                              Solicitações Pendentes ({requests.length})
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {requests.map(req => (
                              <div key={req.id} className="flex items-center justify-between bg-white dark:bg-card p-3 rounded-lg shadow-sm">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarFallback>{req.from_user.username.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{req.from_user.username || `Usuário #${req.from_user.id}`}</p>
                                    <p className="text-xs text-muted-foreground">Quer ser seu amigo</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleRejectRequest(req.id)}>
                                    <XCircle className="h-5 w-5" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="text-green-500 hover:text-green-600 hover:bg-green-50" onClick={() => handleAcceptRequest(req.id)}>
                                    <CheckCircle2 className="h-5 w-5" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      )}

                      {/* Friends List */}
                      {friends.length === 0 ? (
                        <Card>
                          <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                            <Users className="h-12 w-12 mb-4 opacity-20" />
                            <p className="text-lg font-medium">Você ainda não tem amigos</p>
                            <p className="text-sm">Convide pessoas para acompanhar seu progresso!</p>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                          {friends.map(friend => (
                            <Card key={friend.id}>
                              <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarFallback>{friend.friend.username.charAt(0).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{friend.friend.username}</p>
                                    <p className="text-xs text-muted-foreground">Amigos desde {new Date(friend.created_at).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => handleRemoveFriend(friend.friend.id)}>
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>

                {/* ACHIEVEMENTS TAB */}
                <TabsContent value="achievements">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {achievements.map(achievement => (
                      <Card key={achievement.id} className={`${achievement.unlocked ? 'border-primary/50 bg-primary/5' : 'opacity-60 grayscale'}`}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            {achievement.title}
                          </CardTitle>
                          {achievement.unlocked ? (
                            <Medal className="h-4 w-4 text-primary" />
                          ) : (
                            <Target className="h-4 w-4 text-muted-foreground" />
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-center py-4">
                            <div className={`p-4 rounded-full ${achievement.unlocked ? 'bg-background shadow-sm' : 'bg-muted'}`}>
                              {achievement.icon}
                            </div>
                          </div>
                          <p className="text-xs text-center text-muted-foreground mt-2">
                            {achievement.description}
                          </p>
                          <div className="mt-4 flex justify-center">
                            {achievement.unlocked ? (
                              <Badge variant="default" className="bg-green-500 hover:bg-green-600">Desbloqueado</Badge>
                            ) : (
                              <Badge variant="outline">Bloqueado</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
