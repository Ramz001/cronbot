-- CreateEnum
CREATE TYPE "AutomationRunStatus" AS ENUM ('pending', 'running', 'success', 'failed', 'skipped');

-- CreateTable
CREATE TABLE "automation_run" (
    "id" TEXT NOT NULL,
    "automationId" TEXT NOT NULL,
    "status" "AutomationRunStatus" NOT NULL DEFAULT 'pending',
    "triggeredBy" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "durationMs" INTEGER,
    "logs" TEXT,
    "error" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "automation_run_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "automation_run_automationId_idx" ON "automation_run"("automationId");

-- CreateIndex
CREATE INDEX "automation_run_automationId_status_idx" ON "automation_run"("automationId", "status");

-- CreateIndex
CREATE INDEX "automation_run_scheduledAt_idx" ON "automation_run"("scheduledAt");

-- CreateIndex
CREATE INDEX "automation_run_status_scheduledAt_idx" ON "automation_run"("status", "scheduledAt");

-- AddForeignKey
ALTER TABLE "automation_run" ADD CONSTRAINT "automation_run_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "Automation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
