import { Prisma, User, UserRoles } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserRepository } from './user.repository';

type UserCreateObject = Pick<
  Prisma.UserCreateArgs['data'],
  'email' | 'password' | 'username'
>;

type UserUpdateObject = Pick<
  Prisma.UserUpdateArgs['data'],
  'password' | 'refreshToken'
>;

type UserUpdateCondition = Prisma.UserWhereUniqueInput;

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async getByEmail(
    email: string,
    tx?: Prisma.TransactionClient,
  ): Promise<User> {
    return this.repository.get(
      {
        where: {
          email,
        },
      },
      tx,
    );
  }

  async getByUserId(
    userId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<User> {
    return this.repository.get(
      {
        where: {
          id: userId,
        },
      },
      tx,
    );
  }

  async updateRole(
    adminId: number,
    userId: number,
    role: UserRoles,
  ): Promise<void> {
    try {
      const [admin, user] = await Promise.all([
        this.getByUserId(adminId),
        this.getByUserId(userId),
      ]);

      if (admin.role !== UserRoles.ADMIN) {
        throw new ForbiddenException(
          'Not allowed update status for another users',
        );
      }

      if (!user) {
        throw new NotFoundException('Updated user not found');
      }

      await this.repository.update({
        where: {
          id: userId,
        },
        data: {
          role,
        },
      });
    } catch (err) {
      throw err; //TODO add checks
    }
  }

  async create(
    user: UserCreateObject,
    tx?: Prisma.TransactionClient,
  ): Promise<User> {
    return this.repository.create(
      {
        data: user,
      },
      tx,
    );
  }

  async update(
    condition: UserUpdateCondition,
    user: UserUpdateObject,
    tx?: Prisma.TransactionClient,
  ): Promise<User> {
    return this.repository.update(
      {
        where: condition,
        data: user,
      },
      tx,
    );
  }
}
