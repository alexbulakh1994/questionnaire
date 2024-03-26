import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '../common/decorators';
import { Public } from '../common/decorators/public.decorator';
import { RefreshTokenGuard } from '../common/guards';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/local/sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUpLocal(@Body() dto: SignUpDto): Promise<Tokens> {
    return this.authService.signUpLocal(dto);
  }

  @Public()
  @Post('/local/sign-in')
  @HttpCode(HttpStatus.OK)
  async signInLocal(@Body() dto: SignInDto): Promise<Tokens> {
    return this.authService.signInLocal(dto);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser('id') userId: number) {
    return this.authService.logout(userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @CurrentUser('id') userId: number,
    @CurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshToken(userId, refreshToken);
  }
}
