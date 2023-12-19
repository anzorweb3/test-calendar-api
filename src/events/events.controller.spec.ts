import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/eventdto';
import { Event } from './entities/event';

// Описываем тестовый модуль для EventsController
describe('EventsController', () => {
  // Объявляем переменные для контроллера и сервиса
  let controller: EventsController;
  let service: EventsService;
  //Тестовый объект события
  const mockEvent = {
    id: 1,
    name: 'Test Event',
    startDate: new Date(),
    endDate: new Date(),
  };
  // Настраиваем тестовый модуль перед каждым тестом
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(null),
            })),
            save: jest.fn().mockResolvedValue(mockEvent),
            find: jest.fn().mockResolvedValue([mockEvent]),
          },
        },
      ],
    }).compile();

    // Получаем экземпляры контроллера и сервиса из тестового модуля
    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService);
  });

  // Проверяем, что контроллер был успешно создан
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Описываем группу тестов для метода create
  describe('create', () => {
    // Тестируем сценарий, когда метод create успешно создает событие
    it('should create an event and return it', async () => {
      // Создаем тестовые данные для DTO и события
      const dto: CreateEventDto = {
        name: 'Test Event',
        startDate: '2020-01-01',
        endDate: '2020-01-02',
      };
      const event: Event = {
        id: 1,
        name: 'Test Event',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2020-01-02'),
      };

      // Мокаем вызов сервиса и возвращаем событие
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve(event));

      // Проверяем, что контроллер возвращает правильное событие
      expect(await controller.create(dto)).toEqual(event);
    });

    // Тестируем сценарий, когда метод create выбрасывает ошибку из-за пересечения дат событий
    it('should throw an error if event dates are overlapping', async () => {
      // Создаем тестовые данные для DTO
      const dto: CreateEventDto = {
        name: 'Test Event',
        startDate: '2020-01-01',
        endDate: '2020-01-02',
      };

      // Мокаем вызов сервиса и возвращаем ошибку
      jest
        .spyOn(service, 'create')
        .mockImplementation(() =>
          Promise.reject(
            new Error('Event dates are overlapping with another event'),
          ),
        );

      // Проверяем, что контроллер выбрасывает правильную ошибку
      try {
        await controller.create(dto);
      } catch (e) {
        expect(e.message).toEqual(
          'Event dates are overlapping with another event',
        );
      }
    });
  });

  // Описываем группу тестов для метода findAll
  describe('findAll', () => {
    // Тестируем сценарий, когда метод findAll успешно возвращает все события
    it('should return all events', async () => {
      // Создаем тестовые данные для событий
      const events: Event[] = [
        {
          id: 1,
          name: 'Test Event 1',
          startDate: new Date('2020-01-01'),
          endDate: new Date('2020-01-02'),
        },
        {
          id: 2,
          name: 'Test Event 2',
          startDate: new Date('2020-01-03'),
          endDate: new Date('2020-01-04'),
        },
      ];

      // Мокаем вызов сервиса и возвращаем все события
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => Promise.resolve(events));

      // Проверяем, что контроллер возвращает правильные события
      expect(await controller.findAll()).toEqual(events);
    });

    // Тестируем сценарий, когда метод findAll выбрасывает ошибку, если события не найдены
    it('should throw an error if no events found', async () => {
      // Мокаем вызов сервиса и возвращаем ошибку
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => Promise.reject(new Error('No events found')));

      // Проверяем, что контроллер выбрасывает правильную ошибку
      try {
        await controller.findAll();
      } catch (e) {
        expect(e.message).toEqual('No events found');
      }
    });
  });
});
