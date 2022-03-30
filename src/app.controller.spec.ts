import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getHello: jest.fn().mockReturnValue("Hello World!")
          }
        }
      ],
    }).compile();

    appService = app.get<AppService>(AppService);
    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // appController.getHello = jest.fn().mockReturnValueOnce("Hello Thanh");
      expect(appController.getHello()).toBe('Hello World!');
    });

    it('should return "Hello, Thanh"', () => {
      appService.getHello = jest.fn().mockReturnValueOnce('Hello, Thanh');
      expect(appService.getHello()).toBe("Hello, Thanh");

    })

  });
});
