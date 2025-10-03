-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "eating_time" TEXT,
ALTER COLUMN "endTime" DROP NOT NULL;
