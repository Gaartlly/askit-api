/*
  Warnings:

  - Added the required column `commentId` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "file" ADD COLUMN     "commentId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
