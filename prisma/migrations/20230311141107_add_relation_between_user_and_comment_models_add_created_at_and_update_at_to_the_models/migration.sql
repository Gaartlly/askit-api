/*
  Warnings:

  - You are about to drop the column `text` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `post` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `file` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_commentId_fkey";

-- AlterTable
ALTER TABLE "comment" DROP COLUMN "text",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "file" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "commentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "post" DROP COLUMN "description",
ADD COLUMN     "content" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "tag" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
