import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async get<T extends Prisma.UserFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.UserFindUniqueArgs>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<User> {
    return (transactionClient || this.prisma).user.findUnique<T>(args);
  }

  async create<T extends Prisma.UserCreateArgs>(
    user: Prisma.SelectSubset<T, Prisma.UserCreateArgs>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<User> {
    return (transactionClient || this.prisma).user.create<T>(user);
  }

  //add update user
  async update<T extends Prisma.UserUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.UserUpdateArgs>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<User> {
    return (transactionClient || this.prisma).user.update<T>(args);
  }
}
