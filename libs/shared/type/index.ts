export type Mock<T> = Partial<Record<keyof T, jest.Mock>>;

export type WithTotal<T> = [T, number];
