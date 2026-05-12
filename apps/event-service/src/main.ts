import { NestFactory } from '@nestjs/core';
import { EventServiceModule } from './event-service.module';
import { ValidationPipe } from '@nestjs/common';
import { SERVICES_PORTS } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(EventServiceModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(SERVICES_PORTS.EVENT_SERVICE);
  console.log(
    `🚀 Server is running on: http://localhost:${SERVICES_PORTS.EVENT_SERVICE}`,
  );
}
bootstrap();
