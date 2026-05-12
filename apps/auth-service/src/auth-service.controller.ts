import { Body, Controller, Get, Post, Headers } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { LoginDto, RegisterDto } from '@app/common/dto';

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  // ---------------- REGISTER ----------------
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authServiceService.register(dto);
  }

  // ---------------- LOGIN ----------------
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authServiceService.login(dto);
  }

  // ---------------- GET PROFILE (microservice style) ----------------
  @Get('get-me')
  async getMe(@Headers('user-id') userId: string) {
    return this.authServiceService.getProfile(userId);
  }
}
