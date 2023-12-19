import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event';
import { validate } from 'class-validator';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async create(name: string, startDate: Date, endDate: Date): Promise<Event> {
    const overlappingEvent = await this.eventsRepository
      .createQueryBuilder('event')
      .where('event.startDate <= :endDate AND event.endDate >= :startDate', {
        startDate,
        endDate,
      })
      .getOne();

    if (overlappingEvent) {
      throw new Error('Event dates are overlapping with another event');
    }

    const event = new Event();
    event.name = name;
    event.startDate = startDate;
    event.endDate = endDate;
    const errors = await validate(event);
    if (errors.length > 0) {
      throw new Error('Event values are invalid (check event name length)');
    }
    if (startDate > endDate) {
      throw new Error('Event start date cannot be greater than end date');
    }
    return this.eventsRepository.save(event);
  }

  async findAll(): Promise<Event[]> {
    try {
      const events = await this.eventsRepository.find();
      if (!events || events.length === 0) {
        throw new HttpException('No events found', HttpStatus.NOT_FOUND);
      }
      return events;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Unexpected error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
