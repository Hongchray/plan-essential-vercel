-- CreateTable
CREATE TABLE "public"."_GuestTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GuestTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_GuestGroups" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GuestGroups_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GuestTags_B_index" ON "public"."_GuestTags"("B");

-- CreateIndex
CREATE INDEX "_GuestGroups_B_index" ON "public"."_GuestGroups"("B");

-- AddForeignKey
ALTER TABLE "public"."_GuestTags" ADD CONSTRAINT "_GuestTags_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_GuestTags" ADD CONSTRAINT "_GuestTags_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_GuestGroups" ADD CONSTRAINT "_GuestGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_GuestGroups" ADD CONSTRAINT "_GuestGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
