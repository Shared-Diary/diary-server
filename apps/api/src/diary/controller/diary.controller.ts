import { DiaryController as Controller } from './diary.controller.decorator';
import { DiaryService } from '../service';

@Controller()
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}
}
