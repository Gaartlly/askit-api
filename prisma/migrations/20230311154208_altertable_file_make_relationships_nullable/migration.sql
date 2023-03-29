-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_commentId_fkey";

-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_postId_fkey";

-- AlterTable
ALTER TABLE "file" ALTER COLUMN "postId" DROP NOT NULL,
ALTER COLUMN "commentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
