import Link from "next/link";

export default function HomePage() {
  return (
    <section>
      <div className="page-heading">
        <h2>Phoneme Activity Builder</h2>
        <p>
          Create, preview, and generate phoneme-based classroom activities for
          Speech Pathology learning.
        </p>
      </div>

      <div className="activity-grid">
        <Link href="/wordle" className="activity-card">
          <h3>Wordle</h3>
          <p>
            Create a phoneme-based Wordle activity with hints, feedback, and a
            playable preview.
          </p>
          <span>Open Wordle Builder →</span>
        </Link>

        <Link href="/word-search" className="activity-card">
          <h3>Word Search</h3>
          <p>
            Build a phoneme-based word search using a small classroom word list.
          </p>
          <span>Open Word Search Builder →</span>
        </Link>
      </div>
    </section>
  );
}