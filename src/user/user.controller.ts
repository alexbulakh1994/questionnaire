import { UserRoles } from '@prisma/client';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '../common/decorators';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards';
import { UserRoleDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
  @Patch('/role')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateRole(@CurrentUser('id') adminId, @Body() dto: UserRoleDto) {
    const { userId, role } = dto;
    return this.userService.updateRole(adminId, userId, role);
  }
}
