/*
  Warnings:

  - The primary key for the `AssignQuestionnairesUsers` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "AssignQuestionnairesUsers" DROP CONSTRAINT "AssignQuestionnairesUsers_pkey",
ADD CONSTRAINT "AssignQuestionnairesUsers_pkey" PRIMARY KEY ("assignedId", "questionnaireId");
