import { NextResponse } from "next/server";

import {
  ActivityType,
  Prisma,
  UsageEventType,
} from "@/generated/prisma/client";
import { recordUsageEvent } from "@/lib/usage-events";

type UsageEventRequest = {
  eventType?: UsageEventType;
  activityType?: ActivityType;
  activityId?: string;
  page?: string;
  durationMs?: number;
  success?: boolean;
  metadata?: Prisma.InputJsonValue;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as UsageEventRequest;

    if (!body.eventType) {
      return NextResponse.json(
        { error: "eventType is required." },
        { status: 400 },
      );
    }

    if (!Object.values(UsageEventType).includes(body.eventType)) {
      return NextResponse.json(
        { error: "Invalid eventType." },
        { status: 400 },
      );
    }

    if (
      body.activityType &&
      !Object.values(ActivityType).includes(body.activityType)
    ) {
      return NextResponse.json(
        { error: "Invalid activityType." },
        { status: 400 },
      );
    }

    if (
      body.durationMs !== undefined &&
      (!Number.isInteger(body.durationMs) || body.durationMs < 0)
    ) {
      return NextResponse.json(
        { error: "durationMs must be a non negative integer." },
        { status: 400 },
      );
    }

    const event = await recordUsageEvent({
      eventType: body.eventType,
      activityType: body.activityType,
      activityId: body.activityId,
      page: body.page,
      durationMs: body.durationMs,
      success: body.success,
      metadata: body.metadata,
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Failed to record usage event:", error);

    return NextResponse.json(
      { error: "Failed to record usage event." },
      { status: 500 },
    );
  }
}