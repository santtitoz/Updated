import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Eye } from "lucide-react"

export function ProjectsSection() {
  const projects = [
    {
      title: "Chat em Tempo Real",
      author: "@santtitoz",
      description: "Mensageiro com salas, emojis e notificações",
      likes: 235,
      comments: 345,
      views: 45,
    },
    {
      title: "Chat em Tempo Real",
      author: "@santtitoz",
      description: "Mensageiro com salas, emojis e notificações",
      likes: 235,
      comments: 345,
      views: 45,
    },
    {
      title: "Chat em Tempo Real",
      author: "@santtitoz",
      description: "Mensageiro com salas, emojis e notificações",
      likes: 235,
      comments: 345,
      views: 45,
    },
    {
      title: "Chat em Tempo Real",
      author: "@santtitoz",
      description: "Mensageiro com salas, emojis e notificações",
      likes: 235,
      comments: 345,
      views: 45,
    },
    {
      title: "Chat em Tempo Real",
      author: "@santtitoz",
      description: "Mensageiro com salas, emojis e notificações",
      likes: 235,
      comments: 345,
      views: 45,
    },
    {
      title: "Chat em Tempo Real",
      author: "@santtitoz",
      description: "Mensageiro com salas, emojis e notificações",
      likes: 235,
      comments: 345,
      views: 45,
    },
  ]

  return (
    <section className="py-8 md:py-10 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-6">
            <div className="inline-block rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-1.5 mb-3">
              <span className="text-xs font-medium text-white">Comunidade</span>
            </div>
            <h2 className="text-2xl font-bold text-balance md:text-4xl mb-2">Projetos da Comunidade</h2>
            <p className="text-sm text-muted-foreground text-pretty max-w-2xl mx-auto">
              Veja o que outros estudantes estão construindo e compartilhe seus próprios projetos
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mb-4">
            {projects.map((project, index) => (
              <Card key={index} className="border-2 overflow-hidden">
                <div className="relative h-32 bg-gray-200" />
                <CardContent className="p-3">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-gray-300 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-0.5">{project.author}</p>
                      <h3 className="font-semibold text-sm mb-0.5">{project.title}</h3>
                      <p className="text-xs text-muted-foreground">{project.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span>{project.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{project.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{project.views}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              size="default"
              className="bg-foreground text-background hover:bg-foreground/90 px-6 button-gradient-border"
            >
              Ver Todos os Projetos
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
