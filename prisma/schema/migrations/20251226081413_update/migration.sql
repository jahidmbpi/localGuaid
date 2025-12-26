/*
  Warnings:

  - You are about to drop the column `bookingID` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `paymentgetwayData` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `transectionId` on the `payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bookingId]` on the table `payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingId` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionId` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_bookingID_fkey";

-- AlterTable
ALTER TABLE "listing" ADD COLUMN     "bookingCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "bookingID",
DROP COLUMN "paymentgetwayData",
DROP COLUMN "transectionId",
ADD COLUMN     "bookingId" TEXT NOT NULL,
ADD COLUMN     "paymentGatewayData" JSONB,
ADD COLUMN     "transactionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "payment_bookingId_key" ON "payment"("bookingId");

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
