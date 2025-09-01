/*
  Warnings:

  - You are about to drop the column `name` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Tag` table. All the data in the column will be lost.
  - Added the required column `name_en` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_kh` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_kh` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "name",
ADD COLUMN     "name_en" TEXT NOT NULL,
ADD COLUMN     "name_kh" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "name",
ADD COLUMN     "name_en" TEXT NOT NULL,
ADD COLUMN     "name_kh" TEXT NOT NULL;
