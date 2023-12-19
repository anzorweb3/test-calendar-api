import { Controller, Get, Post, Body } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './entities/event';
import { CreateEventDto } from './dto/eventdto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    const { name, startDate, endDate } = createEventDto;
    return this.eventsService.create(
      name,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get()
  findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }
}
