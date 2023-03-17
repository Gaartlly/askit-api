/*
  Warnings:

  - Added the required column `categoryId` to the `tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tag" ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "tagcategory" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tagcategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tag" ADD CONSTRAINT "tag_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "tagcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
