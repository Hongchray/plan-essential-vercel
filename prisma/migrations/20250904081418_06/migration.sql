-- AlterTable
ALTER TABLE "public"."Guest" ADD COLUMN     "number_of_guests" INTEGER,
ADD COLUMN     "status" TEXT DEFAULT 'pending',
ADD COLUMN     "wishing_note" TEXT;
