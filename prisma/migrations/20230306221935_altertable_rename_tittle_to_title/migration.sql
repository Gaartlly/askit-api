/*
  Warnings:

  - You are about to drop the column `tittle` on the `file` table. All the data in the column will be lost.
  - Added the required column `title` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "file" RENAME COLUMN "tittle" TO "title";