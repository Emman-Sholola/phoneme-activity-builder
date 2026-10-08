import Link from "next/link";

export default function HomePage() {
  return (
    <section>
      <div className="page-heading">
        <h2>Phoneme Activity Builder</h2>

        <p>
          Create, manage, monitor, and generate phoneme based classroom
          activities using stored PostgreSQL data and reusable Wordle and Word
          Search configurations.
        </p>
      </div>

      <div className="activity-grid">
        <Link
          href="/wordle"
          className="activity-card"
        >
          <h3>Wordle Builder</h3>

          <p>
            Load a saved Wordle configuration, preview the activity, adjust its
            phoneme settings, and generate a standalone HTML activity.
          </p>

          <span>Open Wordle Builder →</span>
        </Link>

        <Link
          href="/word-search"
          className="activity-card"
        >
          <h3>Word Search Builder</h3>

          <p>
            Build and preview phoneme based Word Search activities using stored
            word lists and database backed activity settings.
          </p>

          <span>Open Word Search Builder →</span>
        </Link>

        <Link
          href="/manage"
          className="activity-card"
        >
          <h3>Manage Data</h3>

          <p>
            Create, update, and delete word lists, phoneme entries, and saved
            activity configurations used by the builders.
          </p>

          <span>Manage Stored Data →</span>
        </Link>

        <Link
          href="/dashboard"
          className="activity-card"
        >
          <h3>Dashboard</h3>

          <p>
            View application health, stored data summaries, activity generation
            statistics, usage metrics, and recent operational events.
          </p>

          <span>View Dashboard →</span>
        </Link>
      </div>
    </section>
  );
}