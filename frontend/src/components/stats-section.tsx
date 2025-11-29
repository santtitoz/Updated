import { Card, CardContent } from "@/components/ui/card"

export function StatsSection() {
  const stats = [
    { label: "Módulos Completos", value: "18", change: "+3 essa semana" },
    { label: "Horas de Estudo", value: "18", change: "+3 essa semana" },
    { label: "Desafios Resolvidos", value: "18", change: "+3 essa semana" },
    { label: "Projetos Criados", value: "18", change: "+3 essa semana" },
  ]

  const weeklyXP = [
    { day: "Seg", xp: 150, isToday: false },
    { day: "Ter", xp: 200, isToday: false },
    { day: "Qua", xp: 600, isToday: false },
    { day: "Qui", xp: 320, isToday: true },
    { day: "Sex", xp: 230, isToday: false },
    { day: "Sáb", xp: 170, isToday: false },
    { day: "Dom", xp: 200, isToday: false, isHighlight: false },
  ]

  const maxXP = 600
  const levels = [600, 450, 300, 150, 0]
  const chartHeight = 180

  const totalWeeklyXP = weeklyXP.reduce((sum, day) => sum + day.xp, 0)

  return (
    <section className="py-4 md:py-6">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-6xl">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-4">
            <div className="inline-block rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 px-5 py-1.5 mb-3">
              <span className="text-xs font-medium text-white">Progresso</span>
            </div>
            <h2 className="text-2xl font-bold text-balance md:text-4xl mb-2">Estatísticas de Aprendizado</h2>
            <p className="text-sm text-muted-foreground text-pretty max-w-2xl mx-auto">
              Acompanhe seu progresso em tempo real com métricas detalhadas e gráficos de evolução
            </p>
          </div>

          <Card className="border-2 border-foreground">
            <CardContent className="p-3">
              <div className="grid gap-2 grid-cols-2 mb-3">
                {stats.map((stat, index) => (
                  <Card key={index} className="border-2">
                    <CardContent className="p-2 text-center">
                      <div className="text-2xl font-bold mb-0.5">{stat.value}</div>
                      <div className="text-xs font-medium mb-0.5">{stat.label}</div>
                      <div className="text-xs text-cyan-500">{stat.change}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2">XP da semana</h3>
                <div className="relative bg-muted/30 rounded-lg p-4 border border-border">
                  <div className="absolute left-4 top-4 bottom-12 flex flex-col justify-between text-xs text-muted-foreground font-medium">
                    {levels.map((level) => (
                      <div key={level} className="text-right w-8">
                        {level}
                      </div>
                    ))}
                  </div>

                  <div className="ml-14">
                    <div className="relative h-48 border-l-2 border-b-2 border-foreground/30 pl-4">
                      <div className="absolute inset-0 flex items-end justify-between gap-2 pb-2 pl-4">
                        {weeklyXP.map((day) => {
                          const heightPx = Math.max((day.xp / maxXP) * chartHeight, 20)

                          return (
                            <div key={day.day} className="flex-1 flex flex-col items-center group relative">
                              <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background px-3 py-2 rounded-lg text-sm font-bold whitespace-nowrap z-10 shadow-xl">
                                <div>{day.xp} XP</div>
                                {day.isToday && <div className="text-xs text-cyan-300">Hoje</div>}
                                {day.isHighlight && <div className="text-xs text-purple-300">Melhor dia!</div>}
                              </div>

                              <div
                                className={`w-full max-w-[60px] rounded-t-lg ${
                                  day.isHighlight
                                    ? "bg-gradient-to-t from-purple-600 via-purple-400 to-pink-400"
                                    : day.isToday
                                      ? "bg-gradient-to-t from-blue-600 via-blue-400 to-cyan-400"
                                      : "bg-gray-400"
                                }`}
                                style={{ height: `${heightPx}px` }}
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pl-4 mt-2">
                      {weeklyXP.map((day) => (
                        <div key={day.day} className="flex-1 text-center">
                          <div
                            className={`text-xs font-medium ${
                              day.isHighlight
                                ? "text-purple-500 font-bold"
                                : day.isToday
                                  ? "text-cyan-500 font-bold"
                                  : ""
                            }`}
                          >
                            {day.day}
                          </div>
                          {day.isToday && <div className="text-[10px] text-cyan-500 font-bold mt-0.5">Hoje</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-center mt-2">
                  <p className="text-sm">
                    Total esta semana:{" "}
                    <span className="font-bold text-cyan-500">{totalWeeklyXP.toLocaleString("pt-BR")} XP</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
