export type PrismaCreateAndUpdateType<T> = Omit<T, 'createdAt' | 'updatedAt'>;

export type WithTotal<T> = [T, number];
