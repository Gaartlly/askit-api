-- CreateTable
CREATE TABLE "comment" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "upvotes" INTEGER NOT NULL,
    "downvotes" INTEGER NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);
