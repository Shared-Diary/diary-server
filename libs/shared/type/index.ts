export type Mock<T = any> = Partial<Record<keyof T, jest.Mock>>;

export type WithTotal<T> = [T, number];
