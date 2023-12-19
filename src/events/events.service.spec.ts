import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventsService } from './events.service';
import { Event } from './entities/event';

// Описание набора тестов для EventsService
describe('EventsService', () => {
  let service: EventsService;
  let repository: Repository<Event>;
  let mockEventRepository;

  //Тестовый объект события
  const mockEvent = {
    id: 1,
    name: 'Событие',
    startDate: new Date(2022, 5, 10),
    endDate: new Date(2022, 5, 12),
  };
  // Выполняется перед каждым тестом. Создает тестовое окружение.
  beforeEach(async () => {
    mockEventRepository = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockResolvedValue(mockEvent),
      find: jest.fn().mockResolvedValue([mockEvent]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: mockEventRepository,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    repository = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  // Тест проверяет, что сервис был успешно создан
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Набор тестов для метода findAll
  describe('findAll', () => {
    // Проверка, что метод возвращает массив событий
    it('should return an array of events', async () => {
      const testEvent = new Event();
      // Мокаем вызов репозитория
      jest.spyOn(repository, 'find').mockResolvedValueOnce([testEvent]);

      // Проверяем, что сервис возвращает ожидаемый результат
      expect(await service.findAll()).toEqual([testEvent]);
    });

    // Проверка, что метод выбрасывает исключение, если события не найдены
    it('should throw a not found exception if no events are found', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);

      // Проверяем, что сервис выбрасывает ожидаемое исключение
      await expect(service.findAll()).rejects.toThrow('No events found');
    });

    // Проверка, что метод выбрасывает исключение при внутренней ошибке
    it('should throw an internal server error if something goes wrong', async () => {
      jest.spyOn(repository, 'find').mockRejectedValueOnce(new Error());

      // Проверяем, что сервис выбрасывает ожидаемое исключение
      await expect(service.findAll()).rejects.toThrow('Unexpected error');
    });
  });

  // Набор тестов для метода create
  describe('create', () => {
    // Тест на корректное создание события
    it('should create valid event', async () => {
      const event = await service.create(
        'Событие',
        new Date(2022, 5, 10),
        new Date(2022, 5, 12),
      );
      expect(event.name).toEqual('Событие');
      expect(event.startDate).toEqual(new Date(2022, 5, 10));
      expect(event.endDate).toEqual(new Date(2022, 5, 12));
    });
    // Тест на создание события, у которого длина названия меньше 1
    it('should throw an exception if invalid event name length', async () => {
      await expect(
        service.create('', new Date(2022, 9, 10), new Date(2022, 12, 12)),
      ).rejects.toThrow('Event values are invalid (check event name length)');
    });
    // Тест на создание события, когда начальная дата больше конечной
    it('should throw an exception if start date greater than end date', async () => {
      mockEventRepository.getOne.mockResolvedValue(null);
      await expect(
        service.create('Событие', new Date(2022, 5, 12), new Date(2022, 5, 10)),
      ).rejects.toThrow('Event start date cannot be greater than end date');
    });

    // Проверяем, что сервис выбрасывает ожидаемое исключение на пересечение дат
    it('throws an exception when event dates are overlapping with another event', async () => {
      mockEventRepository.getOne.mockResolvedValue(mockEvent);
      await expect(
        service.create('test', new Date(), new Date()),
      ).rejects.toThrow('Event dates are overlapping with another event');
    });
  });
});
