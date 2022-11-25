import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';

describe('ApiController', () => {
  let apiController: ApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
    }).compile();

    apiController = app.get<ApiController>(ApiController);
  });

  describe('/', () => {
    it('should return "Hello World!"', () => {
      expect(apiController.getHello()).toBe('health check!!');
    });
  });
});
