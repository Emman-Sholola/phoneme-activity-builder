"use client";

import {
  useEffect,
  useState,
} from "react";

type ActivityType =
  | "WORDLE"
  | "WORD_SEARCH";

type UsageEventType =
  | "PAGE_VIEW"
  | "PAGE_DURATION"
  | "ACTIVITY_CREATED"
  | "ACTIVITY_UPDATED"
  | "ACTIVITY_DELETED"
  | "GENERATION_ATTEMPTED"
  | "GENERATION_SUCCEEDED"
  | "GENERATION_FAILED";

type DashboardSummary = {
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

type RecentUsageEvent = {
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
  createdAt: string;
};

type DashboardReport = {
  summary: DashboardSummary;
  recentEvents: RecentUsageEvent[];
};

type HealthStatus = {
  status?: string;
  database?: string;
};

function formatDuration(
  durationMs: number,
) {
  if (durationMs < 1000) {
    return `${durationMs} ms`;
  }

  const seconds =
    durationMs / 1000;

  if (seconds < 60) {
    return `${seconds.toFixed(1)} sec`;
  }

  const minutes =
    seconds / 60;

  return `${minutes.toFixed(1)} min`;
}

function formatActivityType(
  activityType:
    | ActivityType
    | null,
) {
  if (!activityType) {
    return "No activity data yet";
  }

  return activityType ===
    "WORD_SEARCH"
    ? "Word Search"
    : "Wordle";
}

function formatEventType(
  eventType: UsageEventType,
) {
  return eventType
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

function getEventDescription(
  event: RecentUsageEvent,
) {
  if (event.page) {
    return event.page;
  }

  if (event.activityType) {
    return formatActivityType(
      event.activityType,
    );
  }

  return "Application event";
}

export default function DashboardPage() {
  const [
    report,
    setReport,
  ] =
    useState<DashboardReport | null>(
      null,
    );

  const [
    health,
    setHealth,
  ] =
    useState<HealthStatus | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setError("");

        const [
          reportResponse,
          healthResponse,
        ] =
          await Promise.all([
            fetch(
              "/api/reporting",
              {
                cache:
                  "no-store",
              },
            ),
            fetch(
              "/api/health",
              {
                cache:
                  "no-store",
              },
            ),
          ]);

        if (
          !reportResponse.ok
        ) {
          throw new Error(
            "Failed to load reporting data.",
          );
        }

        const reportData =
          (await reportResponse.json()) as
            DashboardReport;

        setReport(
          reportData,
        );

        if (
          healthResponse.ok
        ) {
          const healthData =
            (await healthResponse.json()) as
              HealthStatus;

          setHealth(
            healthData,
          );
        } else {
          setHealth({
            status:
              "error",
            database:
              "unavailable",
          });
        }
      } catch (
        loadError
      ) {
        setError(
          loadError instanceof
            Error
            ? loadError.message
            : "Failed to load dashboard.",
        );
      } finally {
        setLoading(
          false,
        );
      }
    }

    void loadDashboard();
  }, []);

  if (loading) {
    return (
      <section>
        <div className="page-heading">
          <h2>
            Dashboard
          </h2>

          <p>
            Loading operational
            reporting data...
          </p>
        </div>
      </section>
    );
  }

  if (
    error ||
    !report
  ) {
    return (
      <section>
        <div className="page-heading">
          <h2>
            Dashboard
          </h2>

          <p>
            Monitor application
            activity, reporting
            data, and system
            health.
          </p>
        </div>

        <section className="builderCard">
          <h3>
            Dashboard unavailable
          </h3>

          <p className="mutedText">
            {error ||
              "Reporting data could not be loaded."}
          </p>
        </section>
      </section>
    );
  }

  const {
    summary,
    recentEvents,
  } = report;

  const databaseHealthy =
    health?.status ===
      "ok" &&
    health?.database ===
      "connected";

  return (
    <section>
      <div className="page-heading">
        <h2>
          Dashboard
        </h2>

        <p>
          Monitor stored activity
          data, usage statistics,
          generation results, and
          application health.
        </p>
      </div>

      <div className="dashboardStatus">
        <div>
          <strong>
            System status
          </strong>

          <p className="mutedText">
            Live health check from
            the application backend.
          </p>
        </div>

        <span
          className={
            databaseHealthy
              ? "statusBadge statusHealthy"
              : "statusBadge statusError"
          }
        >
          {databaseHealthy
            ? "Database connected"
            : "Database unavailable"}
        </span>
      </div>

      <section
        className="dashboardSection"
        aria-labelledby="activity-summary-heading"
      >
        <div className="dashboardSectionHeading">
          <div>
            <h3 id="activity-summary-heading">
              Stored Data
            </h3>

            <p className="mutedText">
              Current activity and
              phoneme records stored
              in PostgreSQL.
            </p>
          </div>
        </div>

        <div className="dashboardMetricGrid">
          <article className="dashboardMetric">
            <span>
              Total Activities
            </span>

            <strong>
              {summary.totalActivities}
            </strong>
          </article>

          <article className="dashboardMetric">
            <span>
              Wordle
            </span>

            <strong>
              {summary.wordleActivities}
            </strong>
          </article>

          <article className="dashboardMetric">
            <span>
              Word Search
            </span>

            <strong>
              {summary.wordSearchActivities}
            </strong>
          </article>

          <article className="dashboardMetric">
            <span>
              Word Lists
            </span>

            <strong>
              {summary.totalWordLists}
            </strong>
          </article>

          <article className="dashboardMetric">
            <span>
              Phoneme Words
            </span>

            <strong>
              {summary.totalWords}
            </strong>
          </article>
        </div>
      </section>

      <section
        className="dashboardSection"
        aria-labelledby="generation-heading"
      >
        <div className="dashboardSectionHeading">
          <div>
            <h3 id="generation-heading">
              Activity Generation
            </h3>

            <p className="mutedText">
              Operational results
              recorded when standalone
              activities are generated.
            </p>
          </div>
        </div>

        <div className="dashboardMetricGrid">
          <article className="dashboardMetric">
            <span>
              Attempts
            </span>

            <strong>
              {summary.generationAttempts}
            </strong>
          </article>

          <article className="dashboardMetric">
            <span>
              Successful
            </span>

            <strong>
              {summary.successfulGenerations}
            </strong>
          </article>

          <article className="dashboardMetric">
            <span>
              Failed
            </span>

            <strong>
              {summary.failedGenerations}
            </strong>
          </article>

          <article className="dashboardMetric">
            <span>
              Success Rate
            </span>

            <strong>
              {summary.generationSuccessRate.toFixed(
                0,
              )}
              %
            </strong>
          </article>
        </div>
      </section>

      <section
        className="dashboardSection"
        aria-labelledby="usage-heading"
      >
        <div className="dashboardSectionHeading">
          <div>
            <h3 id="usage-heading">
              Usage Overview
            </h3>

            <p className="mutedText">
              Behaviour recorded from
              application navigation
              and activity usage.
            </p>
          </div>
        </div>

        <div className="dashboardMetricGrid">
          <article className="dashboardMetric">
            <span>
              Average Time on Page
            </span>

            <strong>
              {formatDuration(
                summary.averagePageDurationMs,
              )}
            </strong>
          </article>

          <article className="dashboardMetric">
            <span>
              Most Viewed Page
            </span>

            <strong>
              {summary.mostViewedPage ??
                "No data"}
            </strong>
          </article>

          <article className="dashboardMetric">
            <span>
              Most Used Activity
            </span>

            <strong>
              {formatActivityType(
                summary.mostUsedActivityType,
              )}
            </strong>
          </article>
        </div>
      </section>

      <section
        className="dashboardSection"
        aria-labelledby="recent-events-heading"
      >
        <div className="dashboardSectionHeading">
          <div>
            <h3 id="recent-events-heading">
              Recent Activity
            </h3>

            <p className="mutedText">
              The latest operational
              events recorded by the
              application.
            </p>
          </div>
        </div>

        {recentEvents.length ===
        0 ? (
          <p className="mutedText">
            No usage events have
            been recorded yet.
          </p>
        ) : (
          <div className="dashboardEventList">
            {recentEvents.map(
              (event) => (
                <article
                  key={
                    event.id
                  }
                  className="dashboardEvent"
                >
                  <div>
                    <strong>
                      {formatEventType(
                        event.eventType,
                      )}
                    </strong>

                    <p className="mutedText">
                      {getEventDescription(
                        event,
                      )}
                    </p>
                  </div>

                  <time
                    dateTime={
                      event.createdAt
                    }
                    className="mutedText"
                  >
                    {new Date(
                      event.createdAt,
                    ).toLocaleString()}
                  </time>
                </article>
              ),
            )}
          </div>
        )}
      </section>
    </section>
  );
}