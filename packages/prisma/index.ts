// prisma/client.ts 와 같은 파일

import { PrismaClient } from "./generated/prisma/index.js";

export * from "./generated/prisma/index.js";

const createExtendedPrismaClient = () => {
  return new PrismaClient();
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createExtendedPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
