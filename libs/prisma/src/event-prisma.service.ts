/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/event-client';

@Injectable()
export class EventPrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  [x: string]: any;
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const adapter = new PrismaPg({
      connectionString: process.env.EVENT_SERVICE_DATABASE_URL,
    });
    super({ adapter });
  }
  async onModuleInit() {
    await this.$connect();
    console.log('Event Prisma connected');
  }
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Event Prisma disconnected');
  }
}
