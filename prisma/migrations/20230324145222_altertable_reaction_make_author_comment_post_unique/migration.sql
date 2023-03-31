/*
  Warnings:

  - A unique constraint covering the columns `[authorId,commentId,postId]` on the table `reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "reaction_authorId_commentId_postId_key" ON "reaction"("authorId", "commentId", "postId");
