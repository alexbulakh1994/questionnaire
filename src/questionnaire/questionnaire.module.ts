import { Module } from '@nestjs/common';

import { QuestionnaireController } from './questionnaire.controller';
import { QuestionnaireRepository } from './questionnaire.repository';
import { QuestionnaireService } from './questionnaire.service';

@Module({
  controllers: [QuestionnaireController],
  providers: [QuestionnaireService, QuestionnaireRepository],
})
export class QuestionnaireModule {}
