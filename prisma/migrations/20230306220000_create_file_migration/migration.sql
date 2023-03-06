-- CreateTable
CREATE TABLE "file" (
    "id" SERIAL NOT NULL,
    "tittle" TEXT NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);
