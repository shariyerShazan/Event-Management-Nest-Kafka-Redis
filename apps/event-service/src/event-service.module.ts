import { Module } from '@nestjs/common';
import { EventServiceController } from './event-service.controller';
import { EventServiceService } from './event-service.service';
import { KafkaModule } from '@app/kafka';
import { PrismaModule } from '@app/prisma';

@Module({
  imports: [KafkaModule.register('event-service-group'), PrismaModule],
  controllers: [EventServiceController],
  providers: [EventServiceService],
})
export class EventServiceModule {}
