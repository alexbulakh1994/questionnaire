import { QuestionnaireStatus } from '@prisma/client';

export type StatusTransition = {
  [key in QuestionnaireStatus]: QuestionnaireStatus[];
};
