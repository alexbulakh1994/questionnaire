import {
  AssignQuestionnairesUsers,
  Prisma,
  Questionnaire,
} from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuestionnaireRepository {
  constructor(private prisma: PrismaService) {}

  async get<T extends Prisma.QuestionnaireFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.QuestionnaireFindUniqueArgs>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Questionnaire> {
    return (transactionClient || this.prisma).questionnaire.findUnique<T>(args);
  }

  async find<T extends Prisma.QuestionnaireFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.QuestionnaireFindManyArgs>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Questionnaire[]> {
    return (transactionClient || this.prisma).questionnaire.findMany(args);
  }

  async create<T extends Prisma.QuestionnaireCreateArgs>(
    questionnaire: Prisma.SelectSubset<T, Prisma.QuestionnaireCreateArgs>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Questionnaire> {
    return (transactionClient || this.prisma).questionnaire.create<T>(
      questionnaire,
    );
  }

  async update<T extends Prisma.QuestionnaireUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.QuestionnaireUpdateArgs>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Questionnaire> {
    return (transactionClient || this.prisma).questionnaire.update<T>(args);
  }

  async delete<T extends Prisma.QuestionnaireDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.QuestionnaireDeleteArgs>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Questionnaire> {
    return (transactionClient || this.prisma).questionnaire.delete<T>(args);
  }

  async assign(id, assignerId, userId): Promise<AssignQuestionnairesUsers> {
    return this.prisma.assignQuestionnairesUsers.create({
      data: {
        assignerId,
        assignedId: userId,
        questionnaireId: id,
      },
    });
  }

  async assignedQuestOnMe(
    userId: number,
  ): Promise<AssignQuestionnairesUsers[]> {
    return this.prisma.assignQuestionnairesUsers.findMany({
      where: {
        assignedId: userId,
      },
      include: {
        questionnaire: true,
        assignerBy: {
          select: {
            username: true,
          },
        },
      },
    });
  }
}
