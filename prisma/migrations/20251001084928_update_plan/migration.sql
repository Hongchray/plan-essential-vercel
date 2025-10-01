-- AlterTable
ALTER TABLE "public"."Plan" ADD COLUMN     "limit_export_excel" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "limit_guests" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "limit_template" INTEGER NOT NULL DEFAULT 1;
