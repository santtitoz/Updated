import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function LearningMethodsSection() {
  const methods = [
    { color: "bg-blue-400", gradient: "from-blue-400 to-blue-500" },
    { color: "bg-green-400", gradient: "from-green-400 to-green-500" },
    { color: "bg-purple-500", gradient: "from-purple-500 to-purple-600" },
    { color: "bg-yellow-400", gradient: "from-yellow-400 to-yellow-500" },
    { color: "bg-orange-500", gradient: "from-orange-500 to-orange-600" },
    { color: "bg-teal-400", gradient: "from-teal-400 to-cyan-400" },
  ]

  return (
    <section className="py-6 md:py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-6">
            <div className="inline-block rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 px-5 py-1.5 mb-3">
              <span className="text-xs font-medium text-white">Explore</span>
            </div>
            <h2 className="text-2xl font-bold text-balance md:text-4xl mb-2">Múltiplas Formas de Aprender</h2>
            <p className="text-sm text-muted-foreground text-pretty max-w-2xl mx-auto">
              Escolha entre desafios práticos, projetos guiados, eventos da comunidade e muito mais
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mb-4">
            {methods.map((method, index) => (
              <Card key={index} className="border-2 transition-all">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2.5">
                    <div className={`${method.color} w-12 h-12 rounded-2xl flex-shrink-0`} />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold mb-0.5">Pacotes de Desafios</h3>
                      <p className="text-xs text-muted-foreground mb-1.5">
                        Pratique o que aprendeu com desafios de código curtos e progressivos.
                      </p>
                      <p className="text-xs text-muted-foreground">+200+ Desafios</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-2">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-12 h-12 rounded-2xl flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-semibold mb-0.5">Junte-se à Comunidade</h3>
                    <p className="text-xs text-muted-foreground">
                      Mais de 50.000 desenvolvedores estão aprendendo juntos
                    </p>
                  </div>
                </div>
                <Button
                  size="default"
                  className="bg-foreground text-background hover:bg-foreground/90 px-6 button-gradient-border"
                >
                  Junte-se Agora
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
