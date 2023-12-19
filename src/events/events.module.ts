import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './entities/event';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [EventsService],
  exports: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
