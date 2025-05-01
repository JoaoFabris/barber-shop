import { PrismaClient } from "@/generated/prisma";

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  prisma = global.cachedPrisma;
}

export const db = prisma;

// Função: Este arquivo implementa a lógica para inicializar e compartilhar uma única instância do Prisma Client:

// Padrão Singleton: Implementa um padrão singleton para o Prisma Client, garantindo que apenas uma instância seja criada

// Otimização para desenvolvimento:

// Em produção: Cria uma nova instância do PrismaClient a cada inicialização
// Em desenvolvimento: Armazena a instância na variável global cachedPrisma para reutilização durante hot-reloading
// Prevenção de vazamento de conexões: Evita que múltiplas conexões com o banco de dados sejam criadas durante o desenvolvimento, o que poderia causar erros como "Too many connections"

// Exportação: Exporta a instância do Prisma como db para ser usada em toda a aplicação


// Por que isso é necessário?
// No desenvolvimento Next.js, especialmente com Fast Refresh e hot-reloading, o código é frequentemente recarregado. Sem este padrão singleton:

// Cada recarga criaria uma nova instância do PrismaClient
// Cada instância abriria novas conexões com o banco de dados
// Eventualmente, você atingiria o limite de conexões do seu banco de dados