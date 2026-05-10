/* eslint-disable @typescript-eslint/no-unsafe-return */

import { handleError, SERVICES_PORTS } from '@app/common';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable()
export class AuthService {
  private readonly authServiceUrl = `http:localhost:${SERVICES_PORTS.AUTH_SERVICE}`;
  constructor(private readonly httpService: HttpService) {}

  async register(data: { email: string; name: string; password: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.authServiceUrl}/register`, data),
      );

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }

  async login(data: { email: string; password: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.authServiceUrl}/login`, data),
      );

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }

  async getMe(accessToken: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.authServiceUrl}/get-me`, {
          headers: { Authorization: accessToken },
        }),
      );

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
}
