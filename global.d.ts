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