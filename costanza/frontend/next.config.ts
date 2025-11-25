/** @type {import('next').NextConfig} */
const nextConfig = {
  // Outras configurações do Next.js

  // CONFIGURAÇÃO PARA RESOLVER O ALERTA:
  experimental: {
    turbopack: {
      // Define explicitamente o diretório raiz.
      // Neste caso, a raiz é a pasta onde este arquivo está.
      // O '.' representa o diretório atual do next.config.js.
      root: './', 
    },
  },
  // FIM DA CONFIGURAÇÃO
};

module.exports = nextConfig;