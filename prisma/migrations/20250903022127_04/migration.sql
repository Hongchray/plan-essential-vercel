/*
  Warnings:

  - You are about to drop the `_GuestGroups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GuestTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_GuestGroups" DROP CONSTRAINT "_GuestGroups_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_GuestGroups" DROP CONSTRAINT "_GuestGroups_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_GuestTags" DROP CONSTRAINT "_GuestTags_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_GuestTags" DROP CONSTRAINT "_GuestTags_B_fkey";

-- DropTable
DROP TABLE "public"."_GuestGroups";

-- DropTable
DROP TABLE "public"."_GuestTags";
