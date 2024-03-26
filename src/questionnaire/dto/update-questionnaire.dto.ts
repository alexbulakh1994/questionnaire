import { QuestionnaireStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

import { CreateQuestionnaireDto } from './create-questionnaire.dto';

export class UpdateQuestionnaireDto extends PartialType(
  CreateQuestionnaireDto,
) {
  @IsEnum(QuestionnaireStatus)
  @IsOptional()
  status?: QuestionnaireStatus;
}
