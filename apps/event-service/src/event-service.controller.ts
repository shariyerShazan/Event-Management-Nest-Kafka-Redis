import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { EventServiceService } from './event-service.service';
import { CreateEventDto } from '@app/common/dto/event/create-event.dto';
import { UpdateEventDto } from '@app/common/dto/event/update-event.dto';

@Controller('events')
export class EventServiceController {
  constructor(private readonly eventService: EventServiceService) {}

  // ---------------- CREATE ----------------
  @Post()
  create(@Body() dto: CreateEventDto, @Body('userId') userId: string) {
    return this.eventService.create(dto, userId);
  }

  // ---------------- MY EVENTS ----------------
  @Get('my-events')
  findMyEvents(@Body('userId') userId: string) {
    return this.eventService.findMyEvents(userId);
  }

  // ---------------- GET ALL ----------------
  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  // ---------------- SINGLE ----------------
  @Get(':eventId')
  findOne(@Param('eventId') eventId: string) {
    return this.eventService.findOne(eventId);
  }

  // ---------------- UPDATE ----------------
  @Patch(':eventId')
  updateEvent(
    @Param('eventId') eventId: string,
    @Body() dto: UpdateEventDto,
    @Body('userId') userId: string,
  ) {
    return this.eventService.updateEvent(eventId, dto, userId);
  }

  // ---------------- PUBLISH ----------------
  @Patch(':eventId/publish')
  publish(@Param('eventId') eventId: string, @Body('userId') userId: string) {
    return this.eventService.publishEvent(eventId, userId);
  }

  // ---------------- CANCEL ----------------
  @Patch(':eventId/cancel')
  cancel(@Param('eventId') eventId: string, @Body('userId') userId: string) {
    return this.eventService.cancelEvent(eventId, userId);
  }
}
