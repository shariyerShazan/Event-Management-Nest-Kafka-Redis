import { handleError } from '@app/common';
import { CreateEventDto } from './../../../libs/common/src/dto/event/create-event.dto';
import { KAFKA_SERVICE, KAFKA_TOPICS } from '@app/kafka';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EventPrismaService } from '@app/prisma/event-prisma.service';
import { UpdateEventDto } from '@app/common/dto/event/update-event.dto';

@Injectable()
export class EventServiceService implements OnModuleInit {
  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
    private readonly prisma: EventPrismaService,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async create(createEventDto: CreateEventDto, organizerId: string) {
    try {
      if (!organizerId) {
        throw new UnauthorizedException('Unauthorized');
      }
      const event = await this.prisma.event.create({
        data: {
          title: createEventDto.title,
          description: createEventDto.description,
          organizerId: organizerId,
          location: createEventDto.location,
          price: createEventDto.price,
          status: 'DRAFT',
        },
      });
      this.kafkaClient.emit(KAFKA_TOPICS.EVENT_CREATED, {
        eventId: event.id,
        organizerId: event.organizerId,
        title: event.title,
        timestamp: new Date().toISOString(),
      });
      return {
        message: 'Event created successfully',
        success: true,
        data: event,
      };
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const events = await this.prisma.event.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        success: true,
        message: 'Events fetched successfully',
        data: events,
      };
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(eventId: string) {
    try {
      if (!eventId) {
        throw new BadRequestException('Event id is required');
      }

      const event = await this.prisma.event.findUnique({
        where: {
          id: eventId,
        },
      });

      if (!event) {
        throw new NotFoundException('Event not found');
      }

      return {
        success: true,
        message: 'Event fetched successfully',
        data: event,
      };
    } catch (error) {
      handleError(error);
    }
  }

  async findMyEvents(organizerId: string) {
    try {
      if (!organizerId) {
        throw new UnauthorizedException('Unauthorized');
      }

      const events = await this.prisma.event.findMany({
        where: {
          organizerId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        success: true,
        message: 'Your events fetched successfully',
        data: events,
      };
    } catch (error) {
      handleError(error);
    }
  }

  async updateEvent(
    eventId: string,
    updateEventDto: UpdateEventDto,
    organizerId: string,
  ) {
    try {
      if (!eventId) {
        throw new BadRequestException('Event id is required');
      }

      if (!organizerId) {
        throw new UnauthorizedException('Unauthorized');
      }

      const existingEvent = await this.prisma.event.findUnique({
        where: {
          id: eventId,
        },
      });

      if (!existingEvent) {
        throw new NotFoundException('Event not found');
      }

      if (existingEvent.organizerId !== organizerId) {
        throw new ForbiddenException(
          'You are not allowed to update this event',
        );
      }

      const updatedEvent = await this.prisma.event.update({
        where: {
          id: eventId,
        },
        data: {
          ...updateEventDto,
        },
      });

      this.kafkaClient.emit(KAFKA_TOPICS.EVENT_UPDATED, {
        eventId: updatedEvent.id,
        organizerId: updatedEvent.organizerId,
        title: updatedEvent.title,
        timestamp: new Date().toISOString(),
      });

      return {
        success: true,
        message: 'Event updated successfully',
        data: updatedEvent,
      };
    } catch (error) {
      handleError(error);
    }
  }

  async publishEvent(eventId: string, organizerId: string) {
    try {
      if (!eventId) {
        throw new BadRequestException('Event id is required');
      }

      if (!organizerId) {
        throw new UnauthorizedException('Unauthorized');
      }

      const existingEvent = await this.prisma.event.findUnique({
        where: {
          id: eventId,
        },
      });

      if (!existingEvent) {
        throw new NotFoundException('Event not found');
      }

      if (existingEvent.organizerId !== organizerId) {
        throw new ForbiddenException(
          'You are not allowed to publish this event',
        );
      }

      if (existingEvent.status === 'PUBLISHED') {
        throw new BadRequestException('Event is already published');
      }

      const publishedEvent = await this.prisma.event.update({
        where: {
          id: eventId,
        },
        data: {
          status: 'PUBLISHED',
        },
      });

      this.kafkaClient.emit(KAFKA_TOPICS.EVENT_PUBLISHED, {
        eventId: publishedEvent.id,
        organizerId: publishedEvent.organizerId,
        title: publishedEvent.title,
        timestamp: new Date().toISOString(),
      });

      return {
        success: true,
        message: 'Event published successfully',
        data: publishedEvent,
      };
    } catch (error) {
      handleError(error);
    }
  }

  async cancelEvent(eventId: string, organizerId: string) {
    try {
      if (!eventId) {
        throw new BadRequestException('Event id is required');
      }

      if (!organizerId) {
        throw new UnauthorizedException('Unauthorized');
      }

      const existingEvent = await this.prisma.event.findUnique({
        where: {
          id: eventId,
        },
      });

      if (!existingEvent) {
        throw new NotFoundException('Event not found');
      }

      if (existingEvent.organizerId !== organizerId) {
        throw new ForbiddenException(
          'You are not allowed to cancel this event',
        );
      }

      if (existingEvent.status === 'CANCELLED') {
        throw new BadRequestException('Event is already cancelled');
      }

      const cancelledEvent = await this.prisma.event.update({
        where: {
          id: eventId,
        },
        data: {
          status: 'CANCELLED',
        },
      });

      this.kafkaClient.emit(KAFKA_TOPICS.EVENT_CANCELLED, {
        eventId: cancelledEvent.id,
        organizerId: cancelledEvent.organizerId,
        title: cancelledEvent.title,
        timestamp: new Date().toISOString(),
      });

      return {
        success: true,
        message: 'Event cancelled successfully',
        data: cancelledEvent,
      };
    } catch (error) {
      handleError(error);
    }
  }
}
