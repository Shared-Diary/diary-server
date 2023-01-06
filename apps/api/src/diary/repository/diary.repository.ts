import { Injectable } from '@nestjs/common';
import { Diary, Prisma } from '@prisma/client';

import { PrismaCreateAndUpdateType } from '@app/prisma/type';
import { getKSTDate } from '@app/utils/date';
import { PrismaService } from '@app/prisma';
import { WithTotal } from '@app/shared/type';

import { DiaryIncludeImageAndLike } from '../type';

@Injectable()
export class DiaryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(
    diary: PrismaCreateAndUpdateType<Prisma.DiaryUncheckedCreateInput>,
  ): Promise<Diary> {
    return this.prismaService.diary.create({
      data: {
        createdAt: getKSTDate(),
        updatedAt: getKSTDate(),
        ...diary,
      },
    });
  }

  update(
    id: number,
    diary: PrismaCreateAndUpdateType<Prisma.DiaryUncheckedUpdateInput>,
  ) {
    return this.prismaService.diary.update({
      where: {
        id,
      },
      data: {
        updatedAt: getKSTDate(),
        ...diary,
      },
    });
  }

  findByUnique(diaryWhereUniqueInput: Prisma.DiaryWhereUniqueInput) {
    return this.prismaService.diary.findUnique({
      where: diaryWhereUniqueInput,
    });
  }

  findCount(diaryCountArgs: Prisma.DiaryCountArgs) {
    return this.prismaService.diary.count(diaryCountArgs);
  }

  findListIncludeLikeAndImage({
    page,
    pageSize,
    diaryWhereInput: where,
  }: {
    page: number;
    pageSize: number;
    diaryWhereInput: Prisma.DiaryWhereInput;
  }): Promise<WithTotal<DiaryIncludeImageAndLike[]>> {
    return this.prismaService.$transaction([
      this.prismaService.diary.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          diaryImage: true,
          diaryLike: true,
        },
      }),
      this.prismaService.diary.count({
        where,
      }),
    ]);
  }

  findIncludeLikeAndImage(id: number) {
    return this.prismaService.diary.findFirst({
      where: {
        id,
        diaryLike: {
          some: {
            status: true,
          },
        },
      },
      include: {
        diaryImage: true,
        diaryLike: true,
      },
    });
  }
}
