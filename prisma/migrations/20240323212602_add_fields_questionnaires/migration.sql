/*
  Warnings:

  - The values [PUBLIC] on the enum `QuestionnaireStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `link` to the `Questionnaire` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuestionnaireStatus_new" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVE');
ALTER TABLE "Questionnaire" ALTER COLUMN "status" TYPE "QuestionnaireStatus_new" USING ("status"::text::"QuestionnaireStatus_new");
ALTER TYPE "QuestionnaireStatus" RENAME TO "QuestionnaireStatus_old";
ALTER TYPE "QuestionnaireStatus_new" RENAME TO "QuestionnaireStatus";
DROP TYPE "QuestionnaireStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Questionnaire" ADD COLUMN     "expiredAt" TIMESTAMP(3),
ADD COLUMN     "link" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'GUEST';
