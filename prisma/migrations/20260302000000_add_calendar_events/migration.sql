-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('demo', 'reminder', 'call', 'meeting', 'other');

-- CreateTable
CREATE TABLE "calendar_events" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "type" "EventType" NOT NULL DEFAULT 'other',
    "leadId" INTEGER,
    "createdById" INTEGER,
    "assignedToId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calendar_events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "sales_reps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "sales_reps"("id") ON DELETE SET NULL ON UPDATE CASCADE;
