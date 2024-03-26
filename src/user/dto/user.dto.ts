import { UserRoles } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, Min } from 'class-validator';

export class UserRoleDto {
  @Min(1)
  @IsInt()
  @Type(() => Number)
  userId: number;

  @IsEnum(UserRoles)
  role: UserRoles;
}
