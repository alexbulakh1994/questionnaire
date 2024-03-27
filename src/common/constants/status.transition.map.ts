import { QuestionnaireStatus } from '@prisma/client';

import { StatusTransition } from '../../questionnaire/types';

export const statusTransitionMap: StatusTransition = {
  [QuestionnaireStatus.DRAFT]: [
    QuestionnaireStatus.ACTIVE,
    QuestionnaireStatus.ARCHIVE,
  ],
  [QuestionnaireStatus.ACTIVE]: [QuestionnaireStatus.DRAFT],
  [QuestionnaireStatus.ARCHIVE]: [],
};
