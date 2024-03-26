import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateQuestionnaireDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUrl()
  @IsNotEmpty()
  link: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  company?: string;
}
