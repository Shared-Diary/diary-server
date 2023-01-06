export type PrismaOmitCreateAndUpdateType<T> = Omit<
  T,
  'createdAt' | 'updatedAt'
>;
