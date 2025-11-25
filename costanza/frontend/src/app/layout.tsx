import type React from "react"
import type { Metadata } from "next"
import { Pixelify_Sans } from "next/font/google"
import { Analytics } from '@vercel/analytics/react'
import { Suspense } from "react"

// Importe o componente ClientProviders que encapsula o AuthProvider
// Verifique se o caminho de importação é correto: '../components/ClientProviders'
import { ClientProviders } from "../components/ClientProviders" 

import "./globals.css"

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixelify-sans",
  weight: ["400", "500", "600", "700"],
})

// Metadata: Mantenha a versão mais detalhada do seu projeto Costanza.
export const metadata: Metadata = {
  title: "Costanza - Aprenda a Programar de Forma Gamificada",
  description: "Plataforma de ensino gamificada para aprender programação de forma divertida e eficaz",
  // Você pode adicionar ícones aqui se quiser usar os detalhes do "Projeto Login"
  // icons: { ... },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // Usa o idioma correto
    <html lang="pt-BR"> 
      {/* Aplica a fonte Pixelify Sans como variável CSS */}
      <body className={`${pixelifySans.variable} font-sans antialiased`}>
        {/*
          CRUCIAL PARA O LOGIN/REGISTRO:
          Envolve o conteúdo principal com o ClientProviders.
          Isso garante que o AuthProvider esteja disponível para todas as páginas.
        */}
        <ClientProviders> 
          <Suspense fallback={<div>Loading...</div>}>
            {children}
            {/* Analytics deve estar dentro do ClientProvider para ter acesso ao contexto, se necessário, 
                ou apenas ao 'children' como está. */}
            <Analytics />
          </Suspense>
        </ClientProviders>
      </body>
    </html>
  )
}