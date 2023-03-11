-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_commentId_fkey";

-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_postId_fkey";

-- DropForeignKey
ALTER TABLE "tag" DROP CONSTRAINT "tag_postId_fkey";

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag" ADD CONSTRAINT "tag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
