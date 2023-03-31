/*
  Warnings:

  - A unique constraint covering the columns `[key,categoryId]` on the table `tag` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "tag_key_key";

-- CreateIndex
CREATE UNIQUE INDEX "tag_key_categoryId_key" ON "tag"("key", "categoryId");
