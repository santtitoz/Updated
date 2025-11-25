import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function RankingSection() {
  const rankings = [
    { rank: 1, name: "RIKE", xp: 7841, badge: "Ouro", highlighted: false },
    { rank: 2, name: "ELIABI", xp: 6448, badge: "Ouro", highlighted: true },
    { rank: 3, name: "IURY", xp: 4871, badge: "Ouro", highlighted: false },
    { rank: 4, name: "MAROU", xp: 3948, badge: "Ouro", highlighted: false },
    { rank: 5, name: "MATEUS", xp: 478, badge: "Ouro", highlighted: false },
  ]

  return (
    <section className="py-8 md:py-10">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-6">
            <div className="inline-block rounded-full bg-gradient-to-r from-orange-400 to-orange-500 px-5 py-1.5 mb-3">
              <span className="text-xs font-medium text-white">Conquistas</span>
            </div>
            <h2 className="text-2xl font-bold text-balance md:text-4xl mb-2">Ranking Global</h2>
            <p className="text-sm text-muted-foreground text-pretty max-w-2xl mx-auto">
              Compete com estudantes do mundo todo e suba no ranking conquistando XP através dos desafios e cursos
            </p>
          </div>

          <Card className="border-2 border-foreground">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Top 8 Esta Semana</h3>
                <Button size="sm" className="bg-gradient-to-r from-orange-400 to-orange-500 text-white border-0">
                  Semanal
                </Button>
              </div>

              <div className="space-y-2">
                {rankings.map((user) => (
                  <div
                    key={user.rank}
                    className={`flex items-center justify-between p-2.5 rounded-xl ${
                      user.highlighted ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white" : "bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-full ${
                          user.highlighted ? "bg-white/20" : "bg-orange-400"
                        } flex items-center justify-center`}
                      />
                      <div>
                        <div className="font-bold text-sm">{user.name}</div>
                        <div
                          className={`text-xs flex items-center gap-1 ${user.highlighted ? "text-white/90" : "text-muted-foreground"}`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${user.highlighted ? "bg-white" : "bg-orange-400"}`}
                          />
                          {user.badge}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{user.xp}</div>
                      <div className={`text-xs ${user.highlighted ? "text-white/90" : "text-muted-foreground"}`}>
                        XP
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
