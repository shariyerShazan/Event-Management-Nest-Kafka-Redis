import { Module } from '@nestjs/common';
import { AuthPrismaService } from './auth-prisma.service';
import { EventPrismaService } from './event-prisma.service';

@Module({
  providers: [AuthPrismaService, EventPrismaService],
  exports: [AuthPrismaService, EventPrismaService],
})
export class PrismaModule {}
