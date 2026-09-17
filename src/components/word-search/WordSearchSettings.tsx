import type {
  WordSearchWord,
} from "@/lib/word-search/game";
import type {
  Activity,
} from "@/types/api";

type WordSearchSettingsProps = {
  activities: Activity[];
  selectedActivityId: string;
  loading: boolean;
  error: string;
  words: WordSearchWord[];
  gridSize: number;
  onActivityChange: (
    activityId: string,
  ) => void;
  onWordChange: (
    index: number,
    field: keyof WordSearchWord,
    value: string,
  ) => void;
  onGridSizeChange: (
    value: number,
  ) => void;
  onGenerate: () => void;
};

export default function WordSearchSettings({
  activities,
  selectedActivityId,
  loading,
  error,
  words,
  gridSize,
  onActivityChange,
  onWordChange,
  onGridSizeChange,
  onGenerate,
}: WordSearchSettingsProps) {
  const canGenerate =
    words.length > 0 &&
    words.every(
      (word) =>
        word.phoneme.trim() &&
        word.english.trim(),
    );

  return (
    <section className="builderCard">
      <h3>
        Activity Settings
      </h3>

      <div className="formGroup">
        <label htmlFor="savedWordSearch">
          Saved Word Search Activity
        </label>

        <select
          id="savedWordSearch"
          value={selectedActivityId}
          onChange={(event) => {
            onActivityChange(
              event.target.value,
            );
          }}
          disabled={loading}
        >
          {loading && (
            <option value="">
              Loading activities...
            </option>
          )}

          {!loading &&
            activities.length ===
              0 && (
              <option value="">
                No saved Word Search activities
              </option>
            )}

          {activities.map(
            (activity) => (
              <option
                value={activity.id}
                key={activity.id}
              >
                {activity.name}
              </option>
            ),
          )}
        </select>

        <small>
          Saved activities and words are loaded from the PostgreSQL database.
        </small>
      </div>

      {error && (
        <p
          className="gameMessage"
          role="alert"
        >
          {error}
        </p>
      )}

      <div className="formGroup">
        <label htmlFor="gridSize">
          Grid size
        </label>

        <input
          id="gridSize"
          type="number"
          min="5"
          max="30"
          value={gridSize}
          onChange={(event) => {
            const value =
              Number(
                event.target.value,
              );

            onGridSizeChange(
              Math.max(
                5,
                Math.min(
                  30,
                  value || 5,
                ),
              ),
            );
          }}
        />

        <small>
          The saved activity currently uses a {gridSize} by {gridSize} grid.
        </small>
      </div>

      <p className="mutedText">
        Edit the loaded phoneme words locally to preview different activity content.
      </p>

      <div className="wordSettings">
        {words.map(
          (
            entry,
            index,
          ) => (
            <div
              className="wordSetting"
              key={`word${index}`}
            >
              <strong>
                Word{" "}
                {index + 1}
              </strong>

              <div className="formGroup">
                <label
                  htmlFor={`phoneme${index}`}
                >
                  Phoneme word
                </label>

                <input
                  id={`phoneme${index}`}
                  type="text"
                  value={
                    entry.phoneme
                  }
                  onChange={(event) => {
                    onWordChange(
                      index,
                      "phoneme",
                      event.target.value,
                    );
                  }}
                />
              </div>

              <div className="formGroup">
                <label
                  htmlFor={`english${index}`}
                >
                  English equivalent
                </label>

                <input
                  id={`english${index}`}
                  type="text"
                  value={
                    entry.english
                  }
                  onChange={(event) => {
                    onWordChange(
                      index,
                      "english",
                      event.target.value,
                    );
                  }}
                />
              </div>
            </div>
          ),
        )}
      </div>

      <button
        type="button"
        className="primaryButton"
        onClick={onGenerate}
        disabled={!canGenerate}
      >
        Generate HTML
      </button>
    </section>
  );
}