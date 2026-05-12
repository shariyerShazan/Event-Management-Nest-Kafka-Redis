import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EventService } from './events.service';
import { EventController } from './events.controller';

@Module({
  imports: [HttpModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventsModule {}
