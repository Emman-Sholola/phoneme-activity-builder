-- CreateEnum
CREATE TYPE "UsageEventType" AS ENUM ('PAGE_VIEW', 'PAGE_DURATION', 'ACTIVITY_CREATED', 'ACTIVITY_UPDATED', 'ACTIVITY_DELETED', 'GENERATION_ATTEMPTED', 'GENERATION_SUCCEEDED', 'GENERATION_FAILED');

-- CreateTable
CREATE TABLE "UsageEvent" (
    "id" TEXT NOT NULL,
    "eventType" "UsageEventType" NOT NULL,
    "activityType" "ActivityType",
    "activityId" TEXT,
    "page" TEXT,
    "durationMs" INTEGER,
    "success" BOOLEAN,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UsageEvent_eventType_idx" ON "UsageEvent"("eventType");

-- CreateIndex
CREATE INDEX "UsageEvent_activityType_idx" ON "UsageEvent"("activityType");

-- CreateIndex
CREATE INDEX "UsageEvent_createdAt_idx" ON "UsageEvent"("createdAt");
