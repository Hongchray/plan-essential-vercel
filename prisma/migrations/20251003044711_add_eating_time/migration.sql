/*
  Warnings:

  - Added the required column `eating_time` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "eating_time" TEXT NOT NULL,
ALTER COLUMN "endTime" DROP NOT NULL;
