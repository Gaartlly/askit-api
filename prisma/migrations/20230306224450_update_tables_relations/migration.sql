/*
  Warnings:

  - You are about to drop the column `limited` on the `tag` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_postId_fkey";

-- AlterTable
ALTER TABLE "comment" ADD COLUMN     "parentCommentId" INTEGER,
ALTER COLUMN "upvotes" SET DEFAULT 0,
ALTER COLUMN "downvotes" SET DEFAULT 0,
ALTER COLUMN "postId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tag" DROP COLUMN "limited";

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
