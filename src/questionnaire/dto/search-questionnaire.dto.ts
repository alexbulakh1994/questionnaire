import { QuestionnaireStatus } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

export class SearchQuestionnaireDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsOptional()
  @IsUrl()
  @IsNotEmpty()
  link?: string;

  @IsOptional()
  @IsEnum(QuestionnaireStatus)
  status?: QuestionnaireStatus;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(150)
  limit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;
}
