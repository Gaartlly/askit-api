-- CreateTable
CREATE TABLE "tag" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "limited" BOOLEAN NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tag" ADD CONSTRAINT "tag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
