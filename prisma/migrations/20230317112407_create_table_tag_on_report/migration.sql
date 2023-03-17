-- CreateTable
CREATE TABLE "tagonreport" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "tagId" INTEGER NOT NULL,
    "reportId" INTEGER NOT NULL,

    CONSTRAINT "tagonreport_pkey" PRIMARY KEY ("reportId","tagId")
);

-- AddForeignKey
ALTER TABLE "tagonreport" ADD CONSTRAINT "tagonreport_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tagonreport" ADD CONSTRAINT "tagonreport_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
