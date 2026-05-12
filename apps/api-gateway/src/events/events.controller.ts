/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { CreateEventDto } from '@app/common/dto/event/create-event.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EventService } from './events.service';
import { UpdateEventDto } from '@app/common/dto/event/update-event.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // ---------------- CREATE EVENT ----------------
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create new event' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateEventDto })
  @Post()
  createEvent(@Body() dto: CreateEventDto, @Req() req: any) {
    return this.eventService.createEvent(dto, req.user.userId);
  }

  // ---------------- MY EVENTS ----------------
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get my events' })
  @ApiBearerAuth()
  @Get('my-events')
  findMyEvents(@Req() req: any) {
    return this.eventService.findMyEvents(req.user.userId);
  }

  // ---------------- GET ALL EVENTS ----------------
  @ApiOperation({ summary: 'Get all events' })
  @Get()
  findAllEvents() {
    return this.eventService.findAllEvents();
  }

  // ---------------- GET SINGLE EVENT ----------------
  @ApiOperation({ summary: 'Get single event' })
  @Get(':eventId')
  findSingleEvent(@Param('eventId') eventId: string) {
    return this.eventService.findSingleEvent(eventId);
  }

  // ---------------- UPDATE EVENT ----------------
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update event' })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateEventDto })
  @Patch(':eventId')
  updateEvent(
    @Param('eventId') eventId: string,
    @Body() dto: UpdateEventDto,
    @Req() req: any,
  ) {
    return this.eventService.updateEvent(eventId, dto, req.user.userId);
  }

  // ---------------- PUBLISH EVENT ----------------
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Publish event' })
  @ApiBearerAuth()
  @Patch(':eventId/publish')
  publishEvent(@Param('eventId') eventId: string, @Req() req: any) {
    return this.eventService.publishEvent(eventId, req.user.userId);
  }

  // ---------------- CANCEL EVENT ----------------
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Cancel event' })
  @ApiBearerAuth()
  @Patch(':eventId/cancel')
  cancelEvent(@Param('eventId') eventId: string, @Req() req: any) {
    return this.eventService.cancelEvent(eventId, req.user.userId);
  }
}
