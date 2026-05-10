/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { LoginDto, RegisterDto } from '@app/common/dto';
import { KAFKA_SERVICE, KAFKA_TOPICS } from '@app/kafka';
import { PrismaService } from '@app/prisma';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class AuthServiceService implements OnModuleInit {
  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClinet: ClientKafka,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    await this.kafkaClinet.connect();
  }

  async register(dto: RegisterDto) {
    try {
      const existUser = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
      if (existUser) {
        throw new BadRequestException('User already exists');
      }
      const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
      const hashPass = await bcrypt.hash(dto.password, SALT_ROUNDS);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashPass,
          name: dto.name,
        },
      });
      this.kafkaClinet.emit(KAFKA_TOPICS.USER_REGISTERED, {
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString(),
      });
      const { password, ...safeUser } = user;
      return {
        message: 'User register succeessfully',
        success: true,
        data: safeUser,
      };
    } catch (error: any) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message || 'Internal server error', 500);
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (!user) {
        return {
          message: 'User not found with this email!',
          success: false,
        };
      }
      const isValidPass = await bcrypt.compare(dto.password, user.password);
      if (!isValidPass) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new InternalServerErrorException('JWT secret missing');
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        secret,
        {
          expiresIn: '7d',
        },
      );
      this.kafkaClinet.emit(KAFKA_TOPICS.USER_LOGIN, {
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString(),
      });
      const { password, ...safeUser } = user;
      return {
        message: 'Login successful',
        success: true,
        accessToken: token,
        data: safeUser,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message || 'Internal server error', 500);
    }
  }

  async getProfile(userId: string) {
    try {
      if (!userId) {
        throw new BadRequestException('User ID missing');
      }
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });
      if (!user) {
        throw new UnauthorizedException('User not found!');
      }
      return {
        success: true,
        message: 'Your profile data is fetched',
        data: user,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message || 'Internal server error', 500);
    }
  }
}
