/*
  Warnings:

  - You are about to drop the column `expiredAt` on the `Questionnaire` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Questionnaire" DROP COLUMN "expiredAt",
ADD COLUMN     "company" TEXT;

-- CreateTable
CREATE TABLE "AssignQuestionnairesUsers" (
    "assignerId" INTEGER NOT NULL,
    "questionnaireId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssignQuestionnairesUsers_pkey" PRIMARY KEY ("assignerId","questionnaireId")
);

-- AddForeignKey
ALTER TABLE "AssignQuestionnairesUsers" ADD CONSTRAINT "AssignQuestionnairesUsers_assignerId_fkey" FOREIGN KEY ("assignerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignQuestionnairesUsers" ADD CONSTRAINT "AssignQuestionnairesUsers_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "Questionnaire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
