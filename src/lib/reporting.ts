
import {
  ActivityType,
  UsageEventType,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type DashboardSummary = {
  totalActivities: number;
  wordleActivities: number;
  wordSearchActivities: number;
  totalWordLists: number;
  totalWords: number;
  successfulGenerations: number;
  failedGenerations: number;
  generationAttempts: number;
  generationSuccessRate: number;
  averagePageDurationMs: number;
  mostViewedPage: string | null;
  mostUsedActivityType:
    | ActivityType
    | null;
};

export type RecentUsageEvent = {
  id: string;
  eventType: UsageEventType;
  activityType:
    | ActivityType
    | null;
  activityId:
    | string
    | null;
  page:
    | string
    | null;
  durationMs:
    | number
    | null;
  success:
    | boolean
    | null;
  createdAt: Date;
};

export type DashboardReport = {
  summary: DashboardSummary;
  recentEvents: RecentUsageEvent[];
};

export async function getDashboardReport():
  Promise<DashboardReport> {
  const [
    totalActivities,
    wordleActivities,
    wordSearchActivities,
    totalWordLists,
    totalWords,
    successfulGenerations,
    failedGenerations,
    generationAttempts,
    pageDurationAggregate,
    pageViews,
    activityUsage,
    recentEvents,
  ] = await Promise.all([
    prisma.activity.count(),

    prisma.activity.count({
      where: {
        type:
          ActivityType.WORDLE,
      },
    }),

    prisma.activity.count({
      where: {
        type:
          ActivityType.WORD_SEARCH,
      },
    }),

    prisma.wordList.count(),

    prisma.wordEntry.count(),

    prisma.usageEvent.count({
      where: {
        eventType:
          UsageEventType
            .GENERATION_SUCCEEDED,
      },
    }),

    prisma.usageEvent.count({
      where: {
        eventType:
          UsageEventType
            .GENERATION_FAILED,
      },
    }),

    prisma.usageEvent.count({
      where: {
        eventType:
          UsageEventType
            .GENERATION_ATTEMPTED,
      },
    }),

    prisma.usageEvent.aggregate({
      where: {
        eventType:
          UsageEventType
            .PAGE_DURATION,
        durationMs: {
          not: null,
        },
      },
      _avg: {
        durationMs: true,
      },
    }),

    prisma.usageEvent.groupBy({
      by: [
        "page",
      ],
      where: {
        eventType:
          UsageEventType
            .PAGE_VIEW,
        page: {
          not: null,
        },
      },
      _count: {
        page: true,
      },
      orderBy: {
        _count: {
          page: "desc",
        },
      },
      take: 1,
    }),

    prisma.usageEvent.groupBy({
      by: [
        "activityType",
      ],
      where: {
        activityType: {
          not: null,
        },
        eventType: {
          in: [
            UsageEventType
              .ACTIVITY_CREATED,
            UsageEventType
              .GENERATION_ATTEMPTED,
            UsageEventType
              .GENERATION_SUCCEEDED,
          ],
        },
      },
      _count: {
        activityType: true,
      },
      orderBy: {
        _count: {
          activityType: "desc",
        },
      },
      take: 1,
    }),

    prisma.usageEvent.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      select: {
        id: true,
        eventType: true,
        activityType: true,
        activityId: true,
        page: true,
        durationMs: true,
        success: true,
        createdAt: true,
      },
    }),
  ]);

  const generationSuccessRate =
    generationAttempts > 0
      ? (
          successfulGenerations /
          generationAttempts
        ) * 100
      : 0;

  return {
    summary: {
      totalActivities,
      wordleActivities,
      wordSearchActivities,
      totalWordLists,
      totalWords,
      successfulGenerations,
      failedGenerations,
      generationAttempts,
      generationSuccessRate,
      averagePageDurationMs:
        Math.round(
          pageDurationAggregate
            ._avg
            .durationMs ??
            0,
        ),
      mostViewedPage:
        pageViews[0]
          ?.page ??
        null,
      mostUsedActivityType:
        activityUsage[0]
          ?.activityType ??
        null,
    },

    recentEvents,
  };
}