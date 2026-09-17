"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createWordList,
  deleteWordList,
  getWordLists,
  updateWordList,
} from "@/services/api";
import type {
  WordList,
} from "@/types/api";

type WordListManagerProps = {
  refreshKey: number;
  onChanged: () => void;
};

export default function WordListManager({
  refreshKey,
  onChanged,
}: WordListManagerProps) {
  const [
    wordLists,
    setWordLists,
  ] =
    useState<WordList[]>([]);

  const [
    selectedId,
    setSelectedId,
  ] =
    useState("");

  const [
    name,
    setName,
  ] =
    useState("");

  const [
    description,
    setDescription,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    message,
    setMessage,
  ] =
    useState("");

  async function loadWordLists() {
    try {
      setLoading(true);

      const result =
        await getWordLists();

      setWordLists(
        result,
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to load word lists.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadWordLists();
  }, [refreshKey]);

  function clearForm() {
    setSelectedId("");
    setName("");
    setDescription("");
    setMessage("");
  }

  function selectWordList(
    wordList: WordList,
  ) {
    setSelectedId(
      wordList.id,
    );

    setName(
      wordList.name,
    );

    setDescription(
      wordList.description ??
        "",
    );

    setMessage("");
  }

  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!name.trim()) {
      setMessage(
        "Enter a word list name.",
      );

      return;
    }

    try {
      setSaving(true);
      setMessage("");

      if (selectedId) {
        await updateWordList(
          selectedId,
          {
            name:
              name.trim(),
            description:
              description.trim() ||
              null,
          },
        );

        setMessage(
          "Word list updated successfully.",
        );
      } else {
        await createWordList({
          name:
            name.trim(),
          description:
            description.trim() ||
            null,
        });

        setMessage(
          "Word list created successfully.",
        );
      }

      setSelectedId("");
      setName("");
      setDescription("");

      await loadWordLists();

      onChanged();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save word list.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    wordList: WordList,
  ) {
    const confirmed =
      window.confirm(
        `Delete "${wordList.name}" and all of its stored words?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");

      await deleteWordList(
        wordList.id,
      );

      if (
        selectedId ===
        wordList.id
      ) {
        clearForm();
      }

      await loadWordLists();

      setMessage(
        "Word list deleted successfully.",
      );

      onChanged();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete word list.",
      );
    }
  }

  return (
    <section className="builderCard">
      <div className="managerHeading">
        <div>
          <h3>
            Word Lists
          </h3>

          <p className="mutedText">
            Create collections of phoneme words for your activities.
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
            New List
          </button>
        )}
      </div>

      <form
        onSubmit={
          handleSubmit
        }
      >
        <div className="formGroup">
          <label htmlFor="wordListName">
            List name
          </label>

          <input
            id="wordListName"
            type="text"
            maxLength={100}
            value={name}
            onChange={(event) => {
              setName(
                event.target.value,
              );
            }}
            placeholder="Example: Beginner Consonants"
          />
        </div>

        <div className="formGroup">
          <label htmlFor="wordListDescription">
            Description
          </label>

          <textarea
            id="wordListDescription"
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

        <button
          type="submit"
          className="primaryButton"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : selectedId
              ? "Update Word List"
              : "Create Word List"}
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
            Loading word lists...
          </p>
        )}

        {!loading &&
          wordLists.length ===
            0 && (
            <p className="mutedText">
              No word lists have been created yet.
            </p>
          )}

        {wordLists.map(
          (wordList) => (
            <article
              className="managerItem"
              key={
                wordList.id
              }
            >
              <div>
                <strong>
                  {wordList.name}
                </strong>

                {wordList.description && (
                  <p className="mutedText">
                    {
                      wordList.description
                    }
                  </p>
                )}

                <small>
                  {
                    wordList.words
                      .length
                  }{" "}
                  stored word
                  {wordList.words
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
                    selectWordList(
                      wordList,
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
                      wordList,
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