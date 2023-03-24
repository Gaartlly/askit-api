/*
  Warnings:

  - A unique constraint covering the columns `[authorId,commentId,postId]` on the table `report` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "report_authorId_commentId_postId_key" ON "report"("authorId", "commentId", "postId");
