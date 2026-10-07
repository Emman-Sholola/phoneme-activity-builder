import {
  ActivityType,
  Prisma,
  UsageEventType,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

type UsageEventInput = {
  eventType: UsageEventType;
  activityType?: ActivityType;
  activityId?: string;
  page?: string;
  durationMs?: number;
  success?: boolean;
  metadata?: Prisma.InputJsonValue;
};

export async function recordUsageEvent(input: UsageEventInput) {
  return prisma.usageEvent.create({
    data: {
      eventType: input.eventType,
      activityType: input.activityType,
      activityId: input.activityId,
      page: input.page,
      durationMs: input.durationMs,
      success: input.success,
      metadata: input.metadata,
    },
  });
}

export async function recordUsageEventSafely(
  input: UsageEventInput,
) {
  try {
    await recordUsageEvent(input);
  } catch (error) {
    console.error(
      "Failed to record usage event:",
      error,
    );
  }
}