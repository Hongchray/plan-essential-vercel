/*
  Warnings:

  - You are about to drop the column `amount` on the `Gift` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Gift" DROP COLUMN "amount",
ADD COLUMN     "amount_khr" DOUBLE PRECISION,
ADD COLUMN     "amount_usd" DOUBLE PRECISION;
