/*
  Warnings:

  - You are about to drop the column `amount` on the `Expense` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Expense" DROP COLUMN "amount",
ADD COLUMN     "actual_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "budget_amount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."Guest" ADD COLUMN     "image" TEXT;
