"use client";

import {
  useEffect,
} from "react";
import {
  usePathname,
} from "next/navigation";

type UsageEventBody = {
  eventType:
    | "PAGE_VIEW"
    | "PAGE_DURATION";
  page: string;
  durationMs?: number;
};

async function recordPageEvent(
  body: UsageEventBody,
) {
  try {
    await fetch(
      "/api/usage-events",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body:
          JSON.stringify(body),
        keepalive: true,
      },
    );
  } catch (error) {
    console.error(
      "Failed to record page usage event:",
      error,
    );
  }
}

export default function PageTracker() {
  const pathname =
    usePathname();

  useEffect(() => {
    const startedAt =
      Date.now();

    void recordPageEvent({
      eventType:
        "PAGE_VIEW",
      page:
        pathname,
    });

    return () => {
      const durationMs =
        Date.now() -
        startedAt;

      if (
        durationMs < 1000
      ) {
        return;
      }

      const body =
        JSON.stringify({
          eventType:
            "PAGE_DURATION",
          page:
            pathname,
          durationMs,
        });

      try {
        if (
          navigator.sendBeacon
        ) {
          const blob =
            new Blob(
              [body],
              {
                type:
                  "application/json",
              },
            );

          navigator.sendBeacon(
            "/api/usage-events",
            blob,
          );

          return;
        }

        void fetch(
          "/api/usage-events",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body,
            keepalive: true,
          },
        );
      } catch (error) {
        console.error(
          "Failed to record page duration:",
          error,
        );
      }
    };
  }, [pathname]);

  return null;
}