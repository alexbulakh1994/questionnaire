import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { AuthConfig } from './types/auth.config';
import { SignInDto, SignUpDto } from './dto';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async signUpLocal(dto: SignUpDto): Promise<Tokens> {
    return await this.prisma.$transaction(async (tx) => {
      const hashPassword = await bcrypt.hashSync(dto.password, 5);

      try {
        const newUser: User = await this.userService.create(
          {
            email: dto.email,
            username: dto.username,
            password: hashPassword,
          },
          tx,
        );
        const tokens = await this.getToken(newUser);
        await this.setRefreshToken(newUser.id, tokens.refresh_token, tx);
        return tokens;
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2002') {
            throw new ConflictException('User already exist with such email');
          } else {
            throw new InternalServerErrorException('Service cause error');
          }
        }
        throw err; // need to check
      }
    });
  }
  async signInLocal(dto: SignInDto): Promise<Tokens> {
    return await this.prisma.$transaction(async (tx) => {
      try {
        const user = await this.userService.getByEmail(dto.email, tx);

        if (!user) throw new NotFoundException('User not found');

        const passwordMatches = await bcrypt.compare(
          dto.password,
          user.password,
        );
        if (!passwordMatches)
          throw new UnauthorizedException('Wrong credentials');

        const tokens = await this.getToken(user);
        await this.setRefreshToken(user.id, tokens.refresh_token, tx);
        return tokens;
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          throw new InternalServerErrorException('Service cause error');
        }
        throw err;
      }
    });
  }

  async refreshToken(userId: number, refreshToken: string): Promise<Tokens> {
    return await this.prisma.$transaction(async (tx) => {
      try {
        const user = await this.userService.getByUserId(userId, tx);

        if (!user) throw new NotFoundException('User not found');

        const isTokenMatch = await bcrypt.compare(
          refreshToken,
          user.refreshToken,
        );

        if (!isTokenMatch)
          throw new UnauthorizedException('Refresh token not matched');

        const tokens = await this.getToken(user);
        await this.setRefreshToken(user.id, tokens.refresh_token, tx);
        return tokens;
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          throw new InternalServerErrorException('Service cause error');
        }
        throw err;
      }
    });
  }

  async logout(userId: number) {
    try {
      await this.userService.update(
        {
          id: userId,
          refreshToken: {
            not: null,
          },
        },
        {
          refreshToken: null,
        },
      );
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException('Service cause error');
      }
      throw err;
    }
  }

  async getToken(user: User) {
    const { id, role } = user;
    const {
      expired: { access_token: acExpired, refresh_token: rfExpired },
      secret: { access_token: acSecret, refresh_token: rfSecret },
    } = this.configService.get<AuthConfig>('app.auth');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id,
          role,
        },
        {
          secret: acSecret, //TODO: generate real secret key and add it to enc variables
          expiresIn: acExpired, //TODO: change on env variable from config add to config
        },
      ),
      this.jwtService.signAsync(
        {
          id,
          role,
        },
        {
          secret: rfSecret,
          expiresIn: rfExpired,
        },
      ),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async setRefreshToken(
    userId: number,
    refreshToken: string,
    tx?: Prisma.TransactionClient,
  ) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.update(
      {
        id: userId,
      },
      {
        refreshToken: hashedRefreshToken,
      },
      tx,
    );
  }
}
