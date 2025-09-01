/*
  Warnings:

  - A unique constraint covering the columns `[telegram_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "telegram_id" TEXT,
ADD COLUMN     "telegram_username" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_telegram_id_key" ON "public"."User"("telegram_id");

-- CreateIndex
CREATE INDEX "User_telegram_id_idx" ON "public"."User"("telegram_id");
