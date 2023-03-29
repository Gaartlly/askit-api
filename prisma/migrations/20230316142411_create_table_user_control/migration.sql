-- CreateTable
CREATE TABLE "usercontrol" (
    "id" SERIAL NOT NULL,
    "reason" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usercontrol_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usercontrol_userId_key" ON "usercontrol"("userId");

-- AddForeignKey
ALTER TABLE "usercontrol" ADD CONSTRAINT "usercontrol_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
