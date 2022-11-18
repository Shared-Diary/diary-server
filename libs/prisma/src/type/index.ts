export type PrismaCreateAndUpdateType<T> = Omit<T, 'createdAt' | 'updatedAt'>;
