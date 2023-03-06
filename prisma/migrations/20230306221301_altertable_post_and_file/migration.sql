-- AlterTable
ALTER TABLE "file" ADD COLUMN     "postId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
