import type {
  Activity,
} from "@/types/api";

type WordleSettingsProps = {
  activities: Activity[];
  selectedActivityId: string;
  loading: boolean;
  error: string;
  phonemeWord: string;
  englishWord: string;
  maxGuesses: number;
  onActivityChange: (
    activityId: string,
  ) => void;
  onPhonemeChange: (
    value: string,
  ) => void;
  onEnglishChange: (
    value: string,
  ) => void;
  onMaxGuessesChange: (
    value: number,
  ) => void;
  onGenerate: () => void;
};

export default function WordleSettings({
  activities,
  selectedActivityId,
  loading,
  error,
  phonemeWord,
  englishWord,
  maxGuesses,
  onActivityChange,
  onPhonemeChange,
  onEnglishChange,
  onMaxGuessesChange,
  onGenerate,
}: WordleSettingsProps) {
  return (
    <section className="builderCard">
      <h3>
        Activity Settings
      </h3>

      <div className="formGroup">
        <label htmlFor="savedActivity">
          Saved Wordle Activity
        </label>

        <select
          id="savedActivity"
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
            activities.length === 0 && (
              <option value="">
                No saved Wordle activities
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
          Saved activities are loaded from the PostgreSQL database.
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
        <label htmlFor="phonemeWord">
          Phoneme answer
        </label>

        <input
          id="phonemeWord"
          type="text"
          value={phonemeWord}
          onChange={(event) => {
            onPhonemeChange(
              event.target.value,
            );
          }}
        />

        <small>
          Example: /θɪn/
        </small>
      </div>

      <div className="formGroup">
        <label htmlFor="englishWord">
          English equivalent
        </label>

        <input
          id="englishWord"
          type="text"
          value={englishWord}
          onChange={(event) => {
            onEnglishChange(
              event.target.value,
            );
          }}
        />

        <small>
          Example: thin
        </small>
      </div>

      <div className="formGroup">
        <label htmlFor="maxGuesses">
          Number of guesses
        </label>

        <input
          id="maxGuesses"
          type="number"
          min="1"
          max="20"
          value={maxGuesses}
          onChange={(event) => {
            const value =
              Number(
                event.target.value,
              );

            onMaxGuessesChange(
              Math.max(
                1,
                Math.min(
                  20,
                  value || 1,
                ),
              ),
            );
          }}
        />
      </div>

      <button
        type="button"
        className="primaryButton"
        onClick={onGenerate}
        disabled={
          !phonemeWord.trim() ||
          !englishWord.trim()
        }
      >
        Generate HTML
      </button>
    </section>
  );
}