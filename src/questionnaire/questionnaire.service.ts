import {
  Prisma,
  Questionnaire,
  QuestionnaireStatus,
  User,
  UserRoles,
} from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'nestjs-prisma';
import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import {
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
} from '../common/constants/pagination.constant';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { SearchQuestionnaireDto } from './dto/search-questionnaire.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import { QuestionnaireRepository } from './questionnaire.repository';

@Injectable()
export class QuestionnaireService {
  constructor(
    private readonly repository: QuestionnaireRepository,
    private readonly prisma: PrismaService,
  ) {}
  async create(
    ownerId: number,
    createQuestionnaireDto: CreateQuestionnaireDto,
  ): Promise<Questionnaire> {
    return this.repository.create({
      data: { ...createQuestionnaireDto, createdBy: ownerId },
    });
  }

  async find(
    query: SearchQuestionnaireDto,
    user: User,
  ): Promise<Questionnaire[]> {
    if (user.role === UserRoles.ADMIN) {
      return this.findAll(query);
    }

    return this.findOwned(query, user.id);
  }

  private async findAll(
    query: SearchQuestionnaireDto,
  ): Promise<Questionnaire[]> {
    const {
      offset: skip = DEFAULT_OFFSET,
      limit: take = DEFAULT_LIMIT,
      title,
      ...queryParams
    } = query;
    return this.repository.find({
      where: {
        ...queryParams,
        ...(title && { title: { startsWith: title } }),
      },
      skip,
      take,
    });
  }

  private async findOwned(
    query: SearchQuestionnaireDto,
    userId: number,
  ): Promise<Questionnaire[]> {
    const {
      offset: skip = DEFAULT_OFFSET,
      limit: take = DEFAULT_LIMIT,
      title,
      ...queryParams
    } = query;
    return this.repository.find({
      where: {
        ...queryParams,
        ...(title && { title: { startsWith: title } }),
        createdBy: userId,
      },
      skip,
      take,
    });
  }

  async findOne(
    id: number,
    user: User,
    tx?: Prisma.TransactionClient,
  ): Promise<Questionnaire> {
    const query: Prisma.QuestionnaireWhereUniqueInput = { id };
    if (user.role === UserRoles.USER) {
      query.createdBy = user.id;
    }
    try {
      const questionnaire = await this.repository.get({ where: query }, tx);

      if (!questionnaire) {
        throw new NotFoundException(`Questionnaire with id ${id} not found`);
      }
      return questionnaire;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException(
        'Service get unexpected server error',
        err.message,
      );
    }
  }

  async update(
    id: number,
    updateQuestionnaireDto: UpdateQuestionnaireDto,
    user: User,
  ): Promise<Questionnaire> {
    return this.prisma.$transaction(async (tx) => {
      const questionnaire = await this.findOne(id, user, tx);

      if (!questionnaire) {
        if (user.role === UserRoles.USER) {
          throw new NotFoundException(
            `You dont have questionnaire with ${id} in your list`,
          );
        }

        if (user.role === UserRoles.ADMIN) {
          throw new NotFoundException(
            `Questionnaire with ${id} doesnt exist in a system`,
          );
        }
      }

      if (
        updateQuestionnaireDto.status &&
        this.validateStatusTransition(
          questionnaire.status,
          updateQuestionnaireDto.status,
        )
      ) {
        throw new ConflictException(
          `Questionnaire with id: ${id} could not update status to ${updateQuestionnaireDto.status}. Allowed status are: ...`, //TODO
        );
      }

      return this.repository.update(
        {
          where: {
            id,
          },
          data: updateQuestionnaireDto,
        },
        tx,
      );
    });
  }

  private validateStatusTransition(
    prevStatus: QuestionnaireStatus,
    nextStatus: QuestionnaireStatus,
  ) {
    const statusTransitionMap = {
      //TODO: move map to shared type
      [QuestionnaireStatus.DRAFT]: [
        QuestionnaireStatus.ACTIVE,
        QuestionnaireStatus.ARCHIVE,
      ],
      [QuestionnaireStatus.ACTIVE]: [QuestionnaireStatus.DRAFT],
      [QuestionnaireStatus.ARCHIVE]: [],
    };

    return (
      prevStatus === nextStatus ||
      statusTransitionMap[prevStatus].includes(nextStatus)
    );
  }

  async remove(id: number, user): Promise<void> {
    const query: Prisma.QuestionnaireWhereUniqueInput = { id };
    if (user.role === UserRoles.USER) {
      query.createdBy = user.id;
    }
    try {
      await this.repository.delete({ where: query });
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Questionnaire entity with id: ${id} does not exist`,
        );
      }
    }
  }

  async assign(id: number, assigner: User, userId: number) {
    try {
      return await this.repository.assign(id, assigner.id, userId);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ConflictException(
            `user ${userId} already assigned on questionnaire ${id}`,
          );
        }
      }

      throw new InternalServerErrorException(
        'Service could not assign questionnaire, try latter',
      );
    }
  }

  async assignedOnMe(userId) {
    return this.repository.assignedQuestOnMe(userId);
  }
}
