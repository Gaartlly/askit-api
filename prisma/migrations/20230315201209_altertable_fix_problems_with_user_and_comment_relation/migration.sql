/*
  Warnings:

  - Made the column `postId` on table `file` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_parentCommentId_fkey";

-- AlterTable
ALTER TABLE "comment" ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "file" ALTER COLUMN "postId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
