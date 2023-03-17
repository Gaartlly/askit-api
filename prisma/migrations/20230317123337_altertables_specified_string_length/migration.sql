/*
  Warnings:

  - You are about to alter the column `category` on the `comment` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `content` on the `comment` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - You are about to alter the column `title` on the `course` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `title` on the `file` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `path` on the `file` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - You are about to alter the column `title` on the `post` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `content` on the `post` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(8000)`.
  - You are about to alter the column `reason` on the `report` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - You are about to alter the column `key` on the `tag` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `title` on the `tagcategory` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `email` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - You are about to alter the column `password` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `reason` on the `usercontrol` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.

*/
-- AlterTable
ALTER TABLE "comment" ALTER COLUMN "category" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "content" SET DATA TYPE VARCHAR(1000);

-- AlterTable
ALTER TABLE "course" ALTER COLUMN "title" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "file" ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "path" SET DATA TYPE VARCHAR(1000);

-- AlterTable
ALTER TABLE "post" ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "content" SET DATA TYPE VARCHAR(8000);

-- AlterTable
ALTER TABLE "report" ALTER COLUMN "reason" SET DATA TYPE VARCHAR(1000);

-- AlterTable
ALTER TABLE "tag" ALTER COLUMN "key" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "tagcategory" ALTER COLUMN "title" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(1000),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "usercontrol" ALTER COLUMN "reason" SET DATA TYPE VARCHAR(1000);
