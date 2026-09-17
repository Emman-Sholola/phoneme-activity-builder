"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  createActivity,
  deleteActivity,
  getActivities,
  getWordLists,
  updateActivity,
} from "@/services/api";
import type {
  Activity,
  ActivityType,
  CreateActivityInput,
  Difficulty,
  UpdateActivityInput,
  WordList,
} from "@/types/api";

type ActivityManagerProps = {
  refreshKey: number;
  onChanged: () => void;
};

export default function ActivityManager({
  refreshKey,
  onChanged,
}: ActivityManagerProps) {
  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [wordLists, setWordLists] =
    useState<WordList[]>([]);

  const [selectedId, setSelectedId] =
    useState("");

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [type, setType] =
    useState<ActivityType>("WORDLE");

  const [difficulty, setDifficulty] =
    useState<Difficulty>("MEDIUM");

  const [
    selectedListId,
    setSelectedListId,
  ] = useState("");

  const [
    selectedWordIds,
    setSelectedWordIds,
  ] = useState<string[]>([]);

  const [
    answerWordId,
    setAnswerWordId,
  ] = useState("");

  const [maxGuesses, setMaxGuesses] =
    useState(5);

  const [gridSize, setGridSize] =
    useState(12);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const availableWords =
    useMemo(() => {
      return (
        wordLists.find(
          (wordList) =>
            wordList.id ===
            selectedListId,
        )?.words ?? []
      );
    }, [
      wordLists,
      selectedListId,
    ]);

  async function refreshData() {
    try {
      const [
        loadedActivities,
        loadedWordLists,
      ] =
        await Promise.all([
          getActivities(),
          getWordLists(),
        ]);

      setActivities(
        loadedActivities,
      );

      setWordLists(
        loadedWordLists,
      );

      setSelectedListId(
        (currentId) => {
          const stillExists =
            loadedWordLists.some(
              (wordList) =>
                wordList.id ===
                currentId,
            );

          if (
            currentId &&
            stillExists
          ) {
            return currentId;
          }

          return (
            loadedWordLists[0]?.id ??
            ""
          );
        },
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to load activities.",
      );
    }
  }

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getActivities(),
      getWordLists(),
    ])
      .then(
        ([
          loadedActivities,
          loadedWordLists,
        ]) => {
          if (cancelled) {
            return;
          }

          setActivities(
            loadedActivities,
          );

          setWordLists(
            loadedWordLists,
          );

          setSelectedListId(
            (currentId) => {
              const stillExists =
                loadedWordLists.some(
                  (wordList) =>
                    wordList.id ===
                    currentId,
                );

              if (
                currentId &&
                stillExists
              ) {
                return currentId;
              }

              return (
                loadedWordLists[0]
                  ?.id ?? ""
              );
            },
          );
        },
      )
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        setMessage(
          error instanceof Error
            ? error.message
            : "Failed to load activities.",
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  function clearForm() {
    setSelectedId("");
    setName("");
    setDescription("");
    setType("WORDLE");
    setDifficulty("MEDIUM");
    setSelectedWordIds([]);
    setAnswerWordId("");
    setMaxGuesses(5);
    setGridSize(12);
    setMessage("");

    setSelectedListId(
      wordLists[0]?.id ?? "",
    );
  }

  function selectActivity(
    activity: Activity,
  ) {
    setSelectedId(
      activity.id,
    );

    setName(
      activity.name,
    );

    setDescription(
      activity.description ?? "",
    );

    setType(
      activity.type,
    );

    setDifficulty(
      activity.difficulty,
    );

    setSelectedListId(
      activity.wordListId ?? "",
    );

    setSelectedWordIds(
      activity.words.map(
        (relation) =>
          relation.wordEntryId,
      ),
    );

    setAnswerWordId(
      activity.words.find(
        (relation) =>
          relation.isAnswer,
      )?.wordEntryId ?? "",
    );

    setMaxGuesses(
      activity.maxGuesses ?? 5,
    );

    setGridSize(
      activity.gridSize ?? 12,
    );

    setMessage("");
  }

  function handleTypeChange(
    nextType: ActivityType,
  ) {
    setType(nextType);
    setSelectedWordIds([]);
    setAnswerWordId("");
    setMessage("");
  }

  function handleListChange(
    wordListId: string,
  ) {
    setSelectedListId(
      wordListId,
    );

    setSelectedWordIds([]);
    setAnswerWordId("");
  }

  function toggleWord(
    wordId: string,
  ) {
    setSelectedWordIds(
      (currentIds) =>
        currentIds.includes(
          wordId,
        )
          ? currentIds.filter(
              (id) =>
                id !==
                wordId,
            )
          : [
              ...currentIds,
              wordId,
            ],
    );
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!name.trim()) {
      setMessage(
        "Enter an activity name.",
      );

      return;
    }

    if (!selectedListId) {
      setMessage(
        "Select a word list.",
      );

      return;
    }

    if (
      type === "WORDLE" &&
      !answerWordId
    ) {
      setMessage(
        "Select an answer word for the Wordle activity.",
      );

      return;
    }

    if (
      type === "WORD_SEARCH" &&
      selectedWordIds.length === 0
    ) {
      setMessage(
        "Select at least one word for the Word Search activity.",
      );

      return;
    }

    try {
      setSaving(true);
      setMessage("");

      if (selectedId) {
        const input:
          UpdateActivityInput =
          {
            name:
              name.trim(),

            description:
              description.trim() ||
              null,

            type,

            difficulty,

            wordListId:
              selectedListId,

            ...(type === "WORDLE"
              ? {
                  maxGuesses,
                  gridSize:
                    null,
                  wordEntryIds: [],
                  answerWordId,
                }
              : {
                  maxGuesses:
                    null,
                  gridSize,
                  wordEntryIds:
                    selectedWordIds,
                  answerWordId:
                    null,
                }),
          };

        await updateActivity(
          selectedId,
          input,
        );

        setMessage(
          "Activity updated successfully.",
        );
      } else {
        const input:
          CreateActivityInput =
          {
            name:
              name.trim(),

            description:
              description.trim() ||
              null,

            type,

            difficulty,

            wordListId:
              selectedListId,

            ...(type === "WORDLE"
              ? {
                  maxGuesses,
                  answerWordId,
                  wordEntryIds: [],
                }
              : {
                  gridSize,
                  wordEntryIds:
                    selectedWordIds,
                }),
          };

        await createActivity(
          input,
        );

        setMessage(
          "Activity created successfully.",
        );
      }

      setSelectedId("");
      setName("");
      setDescription("");
      setType("WORDLE");
      setDifficulty("MEDIUM");
      setSelectedWordIds([]);
      setAnswerWordId("");
      setMaxGuesses(5);
      setGridSize(12);

      await refreshData();

      onChanged();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save activity.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    activity: Activity,
  ) {
    const confirmed =
      window.confirm(
        `Delete "${activity.name}"?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteActivity(
        activity.id,
      );

      if (
        selectedId ===
        activity.id
      ) {
        clearForm();
      }

      await refreshData();

      setMessage(
        "Activity deleted successfully.",
      );

      onChanged();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete activity.",
      );
    }
  }

  return (
    <section className="builderCard activityManagerCard">
      <div className="managerHeading">
        <div>
          <h3>
            Saved Activities
          </h3>

          <p className="mutedText">
            Create complete Wordle and Word Search configurations
            using your stored phoneme data.
          </p>
        </div>

        {selectedId && (
          <button
            type="button"
            className="secondaryButton compactButton"
            onClick={
              clearForm
            }
          >
            New Activity
          </button>
        )}
      </div>

      <form
        onSubmit={
          handleSubmit
        }
      >
        <div className="activityFormGrid">
          <div className="formGroup">
            <label htmlFor="activityName">
              Activity name
            </label>

            <input
              id="activityName"
              type="text"
              maxLength={100}
              value={name}
              onChange={(event) => {
                setName(
                  event.target.value,
                );
              }}
              placeholder="Example: TH Practice"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="activityType">
              Activity type
            </label>

            <select
              id="activityType"
              value={type}
              onChange={(event) => {
                handleTypeChange(
                  event.target
                    .value as ActivityType,
                );
              }}
            >
              <option value="WORDLE">
                Wordle
              </option>

              <option value="WORD_SEARCH">
                Word Search
              </option>
            </select>
          </div>

          <div className="formGroup">
            <label htmlFor="activityDifficulty">
              Difficulty
            </label>

            <select
              id="activityDifficulty"
              value={
                difficulty
              }
              onChange={(event) => {
                setDifficulty(
                  event.target
                    .value as Difficulty,
                );
              }}
            >
              <option value="EASY">
                Easy
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="HARD">
                Hard
              </option>
            </select>
          </div>

          <div className="formGroup">
            <label htmlFor="activityWordList">
              Word list
            </label>

            <select
              id="activityWordList"
              value={
                selectedListId
              }
              onChange={(event) => {
                handleListChange(
                  event.target.value,
                );
              }}
            >
              {wordLists.length ===
                0 && (
                <option value="">
                  Create a word list first
                </option>
              )}

              {wordLists.map(
                (wordList) => (
                  <option
                    value={
                      wordList.id
                    }
                    key={
                      wordList.id
                    }
                  >
                    {
                      wordList.name
                    }
                  </option>
                ),
              )}
            </select>
          </div>
        </div>

        <div className="formGroup">
          <label htmlFor="activityDescription">
            Description
          </label>

          <textarea
            id="activityDescription"
            maxLength={500}
            value={description}
            onChange={(event) => {
              setDescription(
                event.target.value,
              );
            }}
            placeholder="Optional description"
          />
        </div>

        {type === "WORDLE" && (
          <>
            <div className="formGroup">
              <label htmlFor="activityAnswer">
                Answer word
              </label>

              <select
                id="activityAnswer"
                value={
                  answerWordId
                }
                onChange={(event) => {
                  setAnswerWordId(
                    event.target.value,
                  );
                }}
              >
                <option value="">
                  Select an answer
                </option>

                {availableWords.map(
                  (word) => (
                    <option
                      value={
                        word.id
                      }
                      key={
                        word.id
                      }
                    >
                      {word.phoneme}
                      {" — "}
                      {word.english}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div className="formGroup">
              <label htmlFor="activityMaxGuesses">
                Maximum guesses
              </label>

              <input
                id="activityMaxGuesses"
                type="number"
                min="1"
                max="20"
                value={
                  maxGuesses
                }
                onChange={(event) => {
                  const value =
                    Number(
                      event.target
                        .value,
                    );

                  setMaxGuesses(
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
          </>
        )}

        {type ===
          "WORD_SEARCH" && (
          <>
            <div className="formGroup">
              <label htmlFor="activityGridSize">
                Grid size
              </label>

              <input
                id="activityGridSize"
                type="number"
                min="5"
                max="30"
                value={
                  gridSize
                }
                onChange={(event) => {
                  const value =
                    Number(
                      event.target
                        .value,
                    );

                  setGridSize(
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
            </div>

            <fieldset className="wordSelectionFieldset">
              <legend>
                Words in activity
              </legend>

              {availableWords.length ===
                0 && (
                <p className="mutedText">
                  This word list does not contain any words.
                </p>
              )}

              <div className="wordSelectionGrid">
                {availableWords.map(
                  (word) => (
                    <label
                      className="wordSelectionOption"
                      key={
                        word.id
                      }
                    >
                      <input
                        type="checkbox"
                        checked={
                          selectedWordIds.includes(
                            word.id,
                          )
                        }
                        onChange={() => {
                          toggleWord(
                            word.id,
                          );
                        }}
                      />

                      <span>
                        <strong>
                          {
                            word.phoneme
                          }
                        </strong>

                        {" — "}

                        {
                          word.english
                        }
                      </span>
                    </label>
                  ),
                )}
              </div>
            </fieldset>
          </>
        )}

        <button
          type="submit"
          className="primaryButton"
          disabled={
            saving ||
            !selectedListId
          }
        >
          {saving
            ? "Saving..."
            : selectedId
              ? "Update Activity"
              : "Create Activity"}
        </button>
      </form>

      <div
        className="gameMessage"
        aria-live="polite"
      >
        {message}
      </div>

      <div className="managerList">
        {loading && (
          <p className="mutedText">
            Loading activities...
          </p>
        )}

        {!loading &&
          activities.length ===
            0 && (
            <p className="mutedText">
              No saved activities have been created yet.
            </p>
          )}

        {activities.map(
          (activity) => (
            <article
              className="managerItem"
              key={
                activity.id
              }
            >
              <div>
                <strong>
                  {activity.name}
                </strong>

                <p>
                  {activity.type ===
                  "WORDLE"
                    ? "Wordle"
                    : "Word Search"}
                  {" · "}
                  {
                    activity.difficulty
                  }
                </p>

                <small className="mutedText">
                  {
                    activity.words
                      .length
                  }{" "}
                  stored word
                  {activity.words
                    .length === 1
                    ? ""
                    : "s"}
                </small>
              </div>

              <div className="managerActions">
                <button
                  type="button"
                  className="secondaryButton compactButton"
                  onClick={() => {
                    selectActivity(
                      activity,
                    );
                  }}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="dangerButton compactButton"
                  onClick={() => {
                    void handleDelete(
                      activity,
                    );
                  }}
                >
                  Delete
                </button>
              </div>
            </article>
          ),
        )}
      </div>
    </section>
  );
}