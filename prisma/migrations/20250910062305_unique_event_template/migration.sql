/*
  Warnings:

  - A unique constraint covering the columns `[eventId,templateId]` on the table `EventTemplate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EventTemplate_eventId_templateId_key" ON "public"."EventTemplate"("eventId", "templateId");
