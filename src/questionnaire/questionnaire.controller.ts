import { User, UserRoles } from '@prisma/client';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '../common/decorators';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { SearchQuestionnaireDto } from './dto/search-questionnaire.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import { QuestionnaireService } from './questionnaire.service';

@Controller('questionnaire')
export class QuestionnaireController {
  constructor(private readonly questionnaireService: QuestionnaireService) {}

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @UseGuards(RolesGuard)
  @Post()
  async create(
    @CurrentUser('id') userId: number,
    @Body() createQuestionnaireDto: CreateQuestionnaireDto,
  ) {
    return this.questionnaireService.create(userId, createQuestionnaireDto);
  }

  @Get('assigned')
  async assignedOnMe(@CurrentUser('id') userId: number) {
    return this.questionnaireService.assignedOnMe(userId);
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @UseGuards(RolesGuard)
  @Get()
  async findAll(
    @CurrentUser() user: User,
    @Query() query: SearchQuestionnaireDto,
  ) {
    return this.questionnaireService.find(query, user);
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @UseGuards(RolesGuard)
  @Get(':id')
  async findOne(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.questionnaireService.findOne(id, user);
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async update(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuestionnaireDto: UpdateQuestionnaireDto,
  ) {
    return this.questionnaireService.update(id, updateQuestionnaireDto, user);
  }

  @Post(':id/assign/:userId')
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @UseGuards(RolesGuard)
  async assign(
    @CurrentUser() assigner: User,
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.questionnaireService.assign(id, assigner, userId);
  }
}
