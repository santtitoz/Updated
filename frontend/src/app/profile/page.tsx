'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { UserProfile, Badge } from "@/types/user";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Save, Edit3, Trophy, Star, Flame, Code2, Map, UserCircle, Medal, Users, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { isAuthenticated, loading: isAuthLoading, user, updateUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [friendsCount, setFriendsCount] = useState(0);
  const [friends, setFriends] = useState<any[]>([]); // Store full friends list

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    arroba: "",
    bio: "",
    stack: "",
    skills: ""
  });

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    async function loadData() {
      try {
        // carregar perfil
        const profileData = await api.getMyProfile();
        setProfile(profileData);
        setFormData({
          nome: profileData.nome || "",
          arroba: profileData.arroba || "",
          bio: profileData.bio || "",
          stack: profileData.stack || "",
          skills: profileData.skills || ""
        });

        // carregar badges
        try {
          const badgesData = await api.getMyBadges();
          const badgesList = Array.isArray(badgesData) ? badgesData : (badgesData.results || []);
          setBadges(badgesList);
        } catch (e) { console.warn("Erro ao carregar badges", e); }

        // carregar amigos
        try {
          const friendsData = await api.getFriends();
          const friendsList = Array.isArray(friendsData) ? friendsData : (friendsData.results || []);
          setFriends(friendsList);
          setFriendsCount(friendsList.length);
        } catch (e) { console.warn("Erro ao carregar amigos", e); }

      } catch (error) {
        console.error("Erro crítico:", error);
        toast({
          variant: "destructive",
          title: "Erro de Conexão",
          description: "Verifique se o backend está online.",
        });
      } finally {
        setIsPageLoading(false);
      }
    }
    loadData();
  }, [isAuthenticated, isAuthLoading, router, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedProfile = await api.updateProfile(formData);
      setProfile(updatedProfile);

      // Update global auth state if user exists
      if (user) {
        const updatedUser = {
          ...user,
          username: updatedProfile.arroba || user.username
        };
        updateUser(updatedUser);
      }

      setIsEditing(false);
      toast({
        title: "Perfil Atualizado!",
        description: "As suas informações foram salvas com sucesso.",
        className: "bg-green-50 border-green-200 text-green-800"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar as alterações.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSearchUsers = async (queryOverride?: string) => {
    const query = queryOverride !== undefined ? queryOverride : searchQuery;
    setSearching(true);
    try {
      const data = await api.searchUsers(query);
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

  if (isAuthLoading || isPageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
      </div>
    );
  }

  // nome 
  // se o perfil não tiver nome, usa o username ou o email
  const displayName = profile?.nome || user?.username || user?.email?.split("@")[0] || "Sem Nome";
  const displayArroba = profile?.arroba || user?.username || "novo_usuario";

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 flex flex-col font-sans">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-10 max-w-6xl mt-16">

        {/* --- CARD PRINCIPAL: IDENTIDADE (Design Pastel/Branco) --- */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          {/* Banner Suave (Pastel) */}
          <div className="h-32 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 border-b border-gray-100 relative"></div>

          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start -mt-12">

              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl bg-white p-1 shadow-lg rotate-3 hover:rotate-0 transition-all duration-300">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-4xl font-bold text-white uppercase">
                    {displayName.charAt(0)}
                  </div>
                </div>
              </div>

              {/* Informações Principais (Com Dados Reais) */}
              <div className="flex-1 pt-14 md:pt-12 w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                      {displayName}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                      <span className="text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded-md text-sm">
                        @{displayArroba}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="text-sm flex items-center gap-1">
                        <Users className="w-3 h-3" /> {friendsCount} Amigos
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant="outline"
                      className={`
                        border-gray-200 shadow-sm transition-all
                        ${isEditing
                          ? "bg-red-50 text-red-600 border-red-100 hover:bg-red-100 hover:border-red-200"
                          : "hover:border-purple-200 hover:text-purple-700 hover:bg-purple-50"}
                        `}
                    >
                      {isEditing ? "Cancelar Edição" : (
                        <>
                          <Edit3 className="w-4 h-4 mr-2" /> Editar Perfil
                        </>
                      )}
                    </Button>

                    <Dialog onOpenChange={(open) => {
                      if (open) {
                        setSearchQuery("");
                        handleSearchUsers(""); // Load suggestions (empty query)
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200">
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
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* --- estatistica e badges --- */}
          <div className="space-y-6">

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                  <Flame className="w-4 h-4 text-orange-500" /> Ofensiva
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {profile?.dias_conectados || 0} <span className="text-sm font-normal text-gray-400">dias</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                  <Star className="w-4 h-4 text-yellow-500" /> XP Total
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {profile?.xp || 0}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                  <Trophy className="w-4 h-4 text-purple-500" /> Nível
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.floor((profile?.xp || 0) / 1000) + 1}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                  <Map className="w-4 h-4 text-green-500" /> Trilhas
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {profile?.trilhas_concluidas || 0}
                </div>
              </div>
            </div>

            {/* conquistas */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Medal className="w-5 h-5 text-yellow-500" /> Conquistas
              </h3>

              {badges.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {badges.map((badge) => (
                    <div key={badge.id} className="flex flex-col items-center text-center group cursor-pointer">
                      <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mb-2 border border-yellow-100 group-hover:scale-110 transition-transform">
                        {badge.image ? (
                          <img src={badge.image} alt={badge.name} className="w-8 h-8 object-contain" />
                        ) : (
                          <Trophy className="w-6 h-6 text-yellow-600" />
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider leading-tight">
                        {badge.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <Trophy className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Ainda sem medalhas.</p>
                </div>
              )}
            </div>

            {/* stack card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-gray-400" /> Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile?.stack ? profile.stack.split(',').map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-medium rounded-lg border border-gray-200"
                  >
                    {tech.trim()}
                  </span>
                )) : (
                  <p className="text-sm text-gray-400 italic">Nenhuma stack definida.</p>
                )}
              </div>
            </div>
          </div>

          {/* --- biografia --- */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 min-h-[500px]">

              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-purple-600" />
                  {isEditing ? "Editar Informações" : "Sobre Mim"}
                </h2>
              </div>

              {isEditing ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome Completo</label>
                      <Input
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        className="bg-gray-50 border-gray-200 focus:bg-white focus:border-purple-500 transition-all h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome de Usuario</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">@</span>
                        <Input
                          name="arroba"
                          value={formData.arroba}
                          onChange={handleInputChange}
                          className="pl-7 bg-gray-50 border-gray-200 focus:bg-white focus:border-purple-500 transition-all h-11"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tech Stack</label>
                    <Input
                      name="stack"
                      value={formData.stack}
                      onChange={handleInputChange}
                      className="bg-gray-50 border-gray-200 focus:bg-white focus:border-purple-500 transition-all h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Skills</label>
                    <Input
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      className="bg-gray-50 border-gray-200 focus:bg-white focus:border-purple-500 transition-all h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Biografia</label>
                    <Textarea
                      name="bio"
                      rows={5}
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="bg-gray-50 border-gray-200 focus:bg-white focus:border-purple-500 transition-all resize-none"
                    />
                  </div>

                  <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      onClick={() => setIsEditing(false)}
                      className="text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-8 shadow-lg shadow-purple-200"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                      Salvar Alterações
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {profile?.bio || "Olá! Ainda não adicionei uma biografia."}
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Competências & Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile?.skills ? profile.skills.split(',').map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-gray-200 text-gray-600 rounded-full text-sm shadow-sm">
                          {skill.trim()}
                        </span>
                      )) : (
                        <span className="text-gray-400 text-sm">Nenhuma skill listada.</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
