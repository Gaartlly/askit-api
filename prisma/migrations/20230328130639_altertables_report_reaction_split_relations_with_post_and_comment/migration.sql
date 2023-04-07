/*
  Warnings:

  - You are about to drop the `_ReportToTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `report` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ReportToTag" DROP CONSTRAINT "_ReportToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ReportToTag" DROP CONSTRAINT "_ReportToTag_B_fkey";

-- DropForeignKey
ALTER TABLE "reaction" DROP CONSTRAINT "reaction_authorId_fkey";

-- DropForeignKey
ALTER TABLE "reaction" DROP CONSTRAINT "reaction_commentId_fkey";

-- DropForeignKey
ALTER TABLE "reaction" DROP CONSTRAINT "reaction_postId_fkey";

-- DropForeignKey
ALTER TABLE "report" DROP CONSTRAINT "report_authorId_fkey";

-- DropForeignKey
ALTER TABLE "report" DROP CONSTRAINT "report_commentId_fkey";

-- DropForeignKey
ALTER TABLE "report" DROP CONSTRAINT "report_postId_fkey";

-- DropTable
DROP TABLE "_ReportToTag";

-- DropTable
DROP TABLE "reaction";

-- DropTable
DROP TABLE "report";

-- CreateTable
CREATE TABLE "postreaction" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "type" "ReactionType" NOT NULL,
    "authorId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "postreaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commentreaction" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "type" "ReactionType" NOT NULL,
    "authorId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,

    CONSTRAINT "commentreaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "postreport" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "reason" VARCHAR(1000) NOT NULL,
    "authorId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "postreport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commentreport" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "reason" VARCHAR(1000) NOT NULL,
    "authorId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,

    CONSTRAINT "commentreport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostReportToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CommentReportToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "postreaction_authorId_postId_key" ON "postreaction"("authorId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "commentreaction_authorId_commentId_key" ON "commentreaction"("authorId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "postreport_authorId_postId_key" ON "postreport"("authorId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "commentreport_authorId_commentId_key" ON "commentreport"("authorId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "_PostReportToTag_AB_unique" ON "_PostReportToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_PostReportToTag_B_index" ON "_PostReportToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CommentReportToTag_AB_unique" ON "_CommentReportToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_CommentReportToTag_B_index" ON "_CommentReportToTag"("B");

-- AddForeignKey
ALTER TABLE "postreaction" ADD CONSTRAINT "postreaction_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postreaction" ADD CONSTRAINT "postreaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentreaction" ADD CONSTRAINT "commentreaction_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentreaction" ADD CONSTRAINT "commentreaction_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postreport" ADD CONSTRAINT "postreport_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postreport" ADD CONSTRAINT "postreport_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentreport" ADD CONSTRAINT "commentreport_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentreport" ADD CONSTRAINT "commentreport_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostReportToTag" ADD CONSTRAINT "_PostReportToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "postreport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostReportToTag" ADD CONSTRAINT "_PostReportToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommentReportToTag" ADD CONSTRAINT "_CommentReportToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "commentreport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommentReportToTag" ADD CONSTRAINT "_CommentReportToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
