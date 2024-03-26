/*
  Warnings:

  - Added the required column `assignedId` to the `AssignQuestionnairesUsers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AssignQuestionnairesUsers" ADD COLUMN     "assignedId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "AssignQuestionnairesUsers" ADD CONSTRAINT "AssignQuestionnairesUsers_assignedId_fkey" FOREIGN KEY ("assignedId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
