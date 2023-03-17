/*
  Warnings:

  - You are about to drop the column `postId` on the `tag` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tag" DROP CONSTRAINT "tag_postId_fkey";

-- AlterTable
ALTER TABLE "tag" DROP COLUMN "postId";
