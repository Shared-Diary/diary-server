export type Mock<T = any> = Partial<Record<keyof T, jest.Mock>>;
