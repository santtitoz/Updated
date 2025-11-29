import { Card, CardContent } from "@/components/ui/card"
import { Star, Orbit, Flame, Coffee, Shield, Puzzle } from "lucide-react"

export function BadgesSection() {
  const badges = [
    {
      name: "O Começo?",
      description: "Complete seu perfil",
      unlocked: true,
      color: "bg-gradient-to-br from-orange-400 to-orange-500",
      icon: Star,
      badge: "Desbloqueado",
      badgeColor: "bg-gradient-to-r from-orange-500 to-orange-600",
    },
    {
      name: "Primeira Vitória",
      description: "Complete seu primeiro módulo",
      unlocked: true,
      color: "bg-gradient-to-br from-blue-400 to-cyan-500",
      icon: Orbit,
      badge: "Desbloqueado",
      badgeColor: "bg-gradient-to-r from-blue-500 to-cyan-600",
    },
    {
      name: "Sequencia",
      description: "Mantenha uma sequência por 7 dias",
      unlocked: true,
      color: "bg-gradient-to-br from-red-400 to-red-500",
      icon: Flame,
      badge: "Desbloqueado",
      badgeColor: "bg-gradient-to-r from-red-500 to-red-600",
    },
    {
      name: "Faça Amigos",
      description: "Alcance o rank Diamante",
      unlocked: false,
      color: "bg-gray-300",
      icon: Coffee,
      progress: 60,
    },
    {
      name: "Domínio",
      description: "Atinja 100% em um curso",
      unlocked: false,
      color: "bg-gray-300",
      icon: Shield,
      progress: 45,
    },
    {
      name: "Colecionador",
      description: "Conclua o primeiro módulo de 7 cursos",
      unlocked: false,
      color: "bg-gray-300",
      icon: Puzzle,
      progress: 70,
    },
  ]

  return (
    <section className="py-6 md:py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-6">
            <div className="inline-block rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-1.5 mb-3">
              <span className="text-xs font-medium text-white">Emblemas</span>
            </div>
            <h2 className="text-2xl font-bold text-balance md:text-4xl mb-2">Sistema de Gadges</h2>
            <p className="text-sm text-muted-foreground text-pretty max-w-2xl mx-auto">
              Desbloqueie conquistas especiais ao completar desafios, manter streaks e atingir marcos importantes
            </p>
          </div>

          <Card className="border-2 border-foreground">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Suas Conquistas</h3>
                <div className="text-right">
                  <div className="text-xl font-bold">3/6</div>
                  <div className="text-xs text-muted-foreground">Desbloqueadas</div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {badges.map((badge, index) => {
                  const Icon = badge.icon
                  return (
                    <Card key={index} className="border-2">
                      <CardContent className="p-3">
                        {badge.unlocked && (
                          <div
                            className={`inline-block ${badge.badgeColor} text-white text-xs px-2.5 py-0.5 rounded-full mb-1.5`}
                          >
                            {badge.badge}
                          </div>
                        )}
                        <div className="flex items-start gap-2.5 mb-2">
                          <div
                            className={`${badge.color} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`}
                          >
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm mb-0.5">{badge.name}</h3>
                            <p className="text-xs text-muted-foreground">{badge.description}</p>
                          </div>
                        </div>
                        {!badge.unlocked && badge.progress !== undefined && (
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Progresso</span>
                              <span className="font-medium">{badge.progress}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all"
                                style={{ width: `${badge.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
