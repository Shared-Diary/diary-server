import * as dayjs from 'dayjs';

import { DIARY_START_AND_END_AT } from '@api/shared/constant';

export const getKSTDate = (date?: string | Date): Date =>
  date ? dayjs(date).add(9, 'hour').toDate() : dayjs().add(9, 'hour').toDate();

export const getDiaryStartAndEndAt = (): {
  startAt: Date;
  endAt: Date;
} => {
  const nowHour = dayjs().hour();
  if (nowHour >= 0 && nowHour <= 3) {
    return {
      startAt: dayjs()
        .startOf('day')
        .add(9 + DIARY_START_AND_END_AT, 'hour')
        .subtract(24, 'hour')
        .toDate(),
      endAt: dayjs()
        .endOf('day')
        .add(9 + DIARY_START_AND_END_AT, 'hour')
        .subtract(24, 'hour')
        .toDate(),
    };
  }

  return {
    startAt: dayjs()
      .startOf('day')
      .add(9 + DIARY_START_AND_END_AT, 'hour')
      .toDate(),
    endAt: dayjs()
      .endOf('day')
      .add(9 + DIARY_START_AND_END_AT, 'hour')
      .toDate(),
  };
};
