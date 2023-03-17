/*
  Warnings:

  - Made the column `postId` on table `reaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `postId` on table `report` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "reaction" DROP CONSTRAINT "reaction_postId_fkey";

-- DropForeignKey
ALTER TABLE "report" DROP CONSTRAINT "report_postId_fkey";

-- AlterTable
ALTER TABLE "reaction" ALTER COLUMN "postId" SET NOT NULL;

-- AlterTable
ALTER TABLE "report" ALTER COLUMN "postId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "reaction" ADD CONSTRAINT "reaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
