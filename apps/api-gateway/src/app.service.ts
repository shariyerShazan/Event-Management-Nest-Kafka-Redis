/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { SERVICES_PORTS } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `API gateway is running on port ${SERVICES_PORTS.API_GATEWAY}`;
  }
}
