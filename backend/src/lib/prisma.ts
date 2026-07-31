import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

let prismaClient: PrismaClient | undefined;

export const getPrismaClient = (): PrismaClient => {
  if (prismaClient) return prismaClient;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required to use Prisma");
  }

  const adapter = new PrismaPg({ connectionString });
  prismaClient = new PrismaClient({ adapter });

  return prismaClient;
};

export const disconnectPrisma = async (): Promise<void> => {
  await prismaClient?.$disconnect();
  prismaClient = undefined;
};
