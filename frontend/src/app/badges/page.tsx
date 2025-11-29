'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


type Badge = {
  id: number;
  name: string;
  description: string;
  icon: string;
};

type UserBadge = {
  id: number;
  badge: Badge;
  earned_at: string;
};

export default function MedalhasPage() {
  const router = useRouter();
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingAll, setLoadingAll] = useState(true);
  const [filtro, setFiltro] = useState<'todos' | 'progresso'>('todos');

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error("Token não encontrado");
      setLoadingUser(false);
      setLoadingAll(false);
      return;
    }

    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };

    // --- Busca userBadges ---
    fetch('http://localhost:8000/api/v1/gamification/badges/mine/', requestOptions)
      .then((res) => {
        if (res.status === 401) {
          throw new Error('Token expirado ou inválido');
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setUserBadges(data);
        } else if (data?.results && Array.isArray(data.results)) {
          setUserBadges(data.results);
        } else {
          setUserBadges([]);
        }
      })
      .catch((err) => {
        console.error('Erro ao buscar userBadges:', err);
        // Se der erro 401, talvez limpar o storage e redirecionar
        if (err.message === 'Token expirado ou inválido') {
          // localStorage.removeItem('access_token');
          // router.push('/login');
        }
        setUserBadges([]);
      })
      .finally(() => setLoadingUser(false));

    // --- Busca allBadges ---
    // Reutiliza o requestOptions pois o header é o mesmo
    fetch('http://localhost:8000/api/v1/gamification/badges/', requestOptions)
      .then((res) => res.json())
      .then((data) => {
        // ... mesma lógica de tratamento de dados ...
        if (Array.isArray(data)) {
          setAllBadges(data);
        } else if (data?.results && Array.isArray(data.results)) {
          setAllBadges(data.results);
        } else {
          setAllBadges([]);
        }
      })
      .catch((err) => {
        console.error('Erro ao buscar badges:', err);
        setAllBadges([]);
      })
      .finally(() => setLoadingAll(false));

  }, [router]); // Adicione router nas dependências

  // Ordena badges: desbloqueados primeiro
  const orderedBadges = [...allBadges].sort((a, b) => {
    const aConquistado = userBadges.some(
      (item) => item.badge.name.trim().toLowerCase() === a.name.trim().toLowerCase()
    );


    const bConquistado = userBadges.some(
      (item) => item.badge.name.trim().toLowerCase() === b.name.trim().toLowerCase()
    );
    if (aConquistado && !bConquistado) return -1;
    if (!aConquistado && bConquistado) return 1;
    return 0;
  });

  const isLoading = loadingUser || loadingAll;

  return (
    <main className="min-h-screen bg-gray-100">

      {/* Banner */}
      <div className="relative w-full">
        <Image
          src="/medalhas/lua-banner.png"
          alt="Explore seu potencial e conquiste Medalhas"
          className="w-full h-auto shadow-lg"
          width={1920}
          height={1080}
          priority
        />
        <h1 className="absolute top-1/2 left-30 transform -translate-y-1/2 text-gray-500 text-2xl md:text-4xl font-bold drop-shadow-lg">
          Explore seu potencial e conquiste
          <br />
          <span className="text-4xl md:text-8xl text-white">Medalhas</span>
        </h1>
      </div>

      {/* Saudação */}
      <div className="max-w-6xl mx-auto px-6 pt-10">
        <section className="flex items-center justify-between p-6 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Bem-vindo(a) à sua jornada de conquistas!
            </h2>
          </div>
        </section>
      </div>

      {/* Conquistas + Progresso */}
      <div className="max-w-6xl mx-auto px-6 pb-8 flex flex-col lg:flex-row gap-8">
        {/* Coluna esquerda */}
        <div className="flex-1 space-y-8">
          {/* Conquistas fixas */}
          <section className="p-6 bg-white rounded-lg shadow border border-black">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Conquistas</h3>
            <div className="grid grid-cols-1 gap-4">
              {['focototal', 'comunicativo', 'frontend'].map((nome) => (
                <div key={nome} className="flex items-center gap-3 p-2">
                  <Image
                    src={`/medalhas/conquistar_${nome}.png`}
                    alt={nome}
                    width={44}
                    height={44}
                    className="rounded-full"
                  />
                  <span className="text-base font-medium text-gray-800 capitalize">{nome}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Medalhas conquistadas */}
          <section className="p-6 bg-white rounded-lg shadow border border-black">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Medalhas no perfil</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {loadingUser ? (
                <p>Carregando medalhas...</p>
              ) : userBadges.length > 0 ? (
                userBadges.map((item) => {
                  console.log('Medalha no perfil:', item.badge.icon);

                  return (
                    <div key={item.id} className="flex flex-col items-center text-center">
                      <img
                        src={`http://localhost:8000${item.badge.icon}`}
                        alt={item.badge.name}
                        className="w-12 h-12 aspect-square object-contain rounded-full"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/medalhas/conquistar_frontend.png';
                        }}
                      />
                      <span className="text-sm mt-2 text-gray-700">{item.badge.name}</span>
                    </div>
                  );
                })
              ) : (
                <p>Nenhuma medalha encontrada.</p>
              )}
            </div>
          </section>
        </div>


        <section className="flex-[2] p-6 bg-white rounded-lg shadow border border-black">
          {/* Botões de filtro */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setFiltro('progresso')}
              className={`px-3 py-1 text-sm rounded ${filtro === 'progresso' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
                }`}
            >
              Em progresso
            </button>
            <button
              onClick={() => setFiltro('todos')}
              className={`px-3 py-1 text-sm rounded ${filtro === 'todos' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
                }`}
            >
              Todos
            </button>
          </div>

          {/* Lista de medalhas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch justify-center">
            {isLoading ? (
              <p className="text-gray-600 col-span-full">Carregando...</p>
            ) : filtro === 'progresso' ? (
              userBadges.length > 0 ? (
                userBadges.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row items-center justify-between border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-all"
                  >
                    {/* Esquerda */}
                    <div className="flex flex-col gap-2 text-center md:text-left mb-4 md:mb-0">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow w-32 mx-auto md:mx-0 text-center">
                        Desbloqueado
                      </span>
                      <h4 className="text-base font-bold text-gray-800">{item.badge.name}</h4>
                      <Link href="#" className="text-purple-600 text-sm hover:underline">
                        Saiba mais
                      </Link>
                      <div className="flex gap-2 mt-1 justify-center md:justify-start">
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">🔥</div>
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">💧</div>
                        <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-white text-xs">⭐</div>
                      </div>
                    </div>

                    {/* Direita */}
                    <div className="flex items-center justify-center w-20 h-20">
                      <img
                        src={`http://localhost:8000${item.badge.icon}`}
                        alt={item.badge.name}
                        className="w-12 h-12 object-contain rounded-full"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/medalhas/conquistar_frontend.png';
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 col-span-full">Você ainda não conquistou nenhuma medalha.</p>
              )
            ) : orderedBadges.length > 0 ? (
              orderedBadges.map((badge) => {
                const conquistado = userBadges.some(
                  (item) => item.badge.name.trim().toLowerCase() === badge.name.trim().toLowerCase()
                );

                const iconSrc = badge.icon?.startsWith('http')
                  ? badge.icon
                  : `http://localhost:8000${badge.icon}`;

                return (
                  <div
                    key={badge.id}
                    className="flex flex-col md:flex-row items-center justify-between border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-all"
                  >
                    {/* Esquerda */}
                    <div className="flex flex-col gap-2 text-center md:text-left mb-4 md:mb-0">
                      <span
                        className={`text-xs font-bold px-4 py-1 rounded-full shadow w-32 mx-auto md:mx-0 text-center ${conquistado
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                          }`}
                      >
                        {conquistado ? 'Desbloqueado' : 'Não iniciado'}
                      </span>
                      <h4 className="text-base font-bold text-gray-800">{badge.name}</h4>
                      <Link href="#" className="text-purple-600 text-sm hover:underline">
                        Saiba mais
                      </Link>
                      <div className="flex gap-2 mt-1 justify-center md:justify-start">
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">🔥</div>
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">💧</div>
                        <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-white text-xs">⭐</div>
                      </div>
                    </div>

                    {/* Direita */}
                    <div className="flex items-center justify-center w-20 h-20">
                      <img
                        src={iconSrc}
                        alt={badge.name}
                        className="w-12 h-12 object-contain rounded-full"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/medalhas/conquistar_frontend.png';
                        }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-600 col-span-full">Nenhum badge disponível.</p>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
