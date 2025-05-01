import { PrismaClient } from "@/generated/prisma";

declare global {
  namespace NodeJS {
    interface Global {
      cachedPrisma: PrismaClient | undefined;
    }
  }

  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient | undefined;
}

export {};

// Função: Este arquivo está apenas declarando tipos para o TypeScript. Ele:

// Define um tipo global para cachedPrisma
// Informa ao TypeScript que existe uma variável global chamada cachedPrisma do tipo PrismaClient
// Não implementa nenhuma funcionalidade, apenas fornece informações de tipo