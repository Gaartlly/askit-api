/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `tag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tag_key_key" ON "tag"("key");
