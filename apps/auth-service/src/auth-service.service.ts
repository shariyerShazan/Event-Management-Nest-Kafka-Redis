/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { KAFKA_SERVICE, KAFKA_TOPICS } from '@app/kafka';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AuthServiceService implements OnModuleInit {
  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClinet: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClinet.connect();
  }

  getHello(): string {
    return 'hello world!';
  }

  simulateUserRegistration(email: string) {
    this.kafkaClinet.emit(KAFKA_TOPICS.USER_REGISTERED, {
      email,
      timestamp: new Date().toISOString(),
    });
    return { message: `User registed: ${email}` };
  }
}
