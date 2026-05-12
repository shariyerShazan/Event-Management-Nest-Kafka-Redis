/* eslint-disable @typescript-eslint/no-unsafe-return */
import { handleError, SERVICES_PORTS } from '@app/common';
import { CreateEventDto } from '@app/common/dto/event/create-event.dto';
import { UpdateEventDto } from '@app/common/dto/event/update-event.dto';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventService {
  private readonly eventServiceUrl = `http://localhost:${SERVICES_PORTS.EVENT_SERVICE}`;

  constructor(private readonly httpService: HttpService) {}

  async createEvent(data: CreateEventDto, token: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.eventServiceUrl}/events`, data, {
          headers: {
            Authorization: token,
          },
        }),
      );

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }

  async findAllEvents() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.eventServiceUrl}/events`),
      );

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }

  async findSingleEvent(eventId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.eventServiceUrl}/events/${eventId}`),
      );

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }

  async updateEvent(eventId: string, data: UpdateEventDto, token: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(
          `${this.eventServiceUrl}/events/${eventId}`,
          data,
          {
            headers: {
              Authorization: token,
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }

  async publishEvent(eventId: string, token: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(
          `${this.eventServiceUrl}/events/${eventId}/publish`,
          {},
          {
            headers: {
              Authorization: token,
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }

  async cancelEvent(eventId: string, token: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(
          `${this.eventServiceUrl}/events/${eventId}/cancel`,
          {},
          {
            headers: {
              Authorization: token,
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }

  async findMyEvents(token: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.eventServiceUrl}/events/my-events`, {
          headers: {
            Authorization: token,
          },
        }),
      );

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
}
