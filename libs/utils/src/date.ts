import * as dayjs from 'dayjs';

export const getKSTDate = (date?: string | Date): Date =>
  date ? dayjs(date).add(9, 'hour').toDate() : dayjs().add(9, 'hour').toDate();
