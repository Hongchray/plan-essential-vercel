/*
  Warnings:

  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `telegram_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `telegram_username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[telegramId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."User_telegram_id_idx";

-- DropIndex
DROP INDEX "public"."User_telegram_id_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "image",
DROP COLUMN "telegram_id",
DROP COLUMN "telegram_username",
ADD COLUMN     "photoUrl" TEXT,
ADD COLUMN     "telegramId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_key" ON "public"."User"("telegramId");

-- CreateIndex
CREATE INDEX "User_telegramId_idx" ON "public"."User"("telegramId");
