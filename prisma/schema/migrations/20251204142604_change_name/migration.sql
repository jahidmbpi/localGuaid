/*
  Warnings:

  - You are about to drop the `GuideInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GuideInfo" DROP CONSTRAINT "GuideInfo_userId_fkey";

-- DropTable
DROP TABLE "GuideInfo";

-- CreateTable
CREATE TABLE "guaidInfo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expertise" TEXT[],
    "dailyRate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "guaidInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guaidInfo_userId_key" ON "guaidInfo"("userId");

-- AddForeignKey
ALTER TABLE "guaidInfo" ADD CONSTRAINT "guaidInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
