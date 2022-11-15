import { PrismaClient } from '@prisma/client';

export type PrismaType = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
>;
