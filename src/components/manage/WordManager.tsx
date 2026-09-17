"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createWord,
  deleteWord,
  getWordLists,
  getWords,
  updateWord,
} from "@/services/api";
import type {
  WordEntry,
  WordList,
} from "@/types/api";

type WordManagerProps = {
  refreshKey: number;
  onChanged: () => void;
};

export default function WordManager({
  refreshKey,
  onChanged,
}: WordManagerProps) {
  const [
    words,
    setWords,
  ] =
    useState<WordEntry[]>([]);

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
    selectedListId,
    setSelectedListId,
  ] =
    useState("");

  const [
    phoneme,
    setPhoneme,
  ] =
    useState("");

  const [
    english,
    setEnglish,
  ] =
    useState("");

  const [
    hint,
    setHint,
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

  const filteredWords =
    useMemo(() => {
      if (!selectedListId) {
        return words;
      }

      return words.filter(
        (word) =>
          word.wordListId ===
          selectedListId,
      );
    }, [
      words,
      selectedListId,
    ]);

  async function loadData() {
    try {
      setLoading(true);

      const [
        loadedWords,
        loadedLists,
      ] =
        await Promise.all([
          getWords(),
          getWordLists(),
        ]);

      setWords(
        loadedWords,
      );

      setWordLists(
        loadedLists,
      );

      if (
        !selectedListId &&
        loadedLists.length > 0
      ) {
        setSelectedListId(
          loadedLists[0].id,
        );
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to load phoneme words.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, [refreshKey]);

  function clearForm() {
    setSelectedId("");
    setPhoneme("");
    setEnglish("");
    setHint("");
    setMessage("");
  }

  function selectWord(
    word: WordEntry,
  ) {
    setSelectedId(
      word.id,
    );

    setSelectedListId(
      word.wordListId,
    );

    setPhoneme(
      word.phoneme,
    );

    setEnglish(
      word.english,
    );

    setHint(
      word.hint ?? "",
    );

    setMessage("");
  }

  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!selectedListId) {
      setMessage(
        "Select a word list first.",
      );

      return;
    }

    if (
      !phoneme.trim() ||
      !english.trim()
    ) {
      setMessage(
        "Phoneme and English equivalent are required.",
      );

      return;
    }

    try {
      setSaving(true);
      setMessage("");

      if (selectedId) {
        await updateWord(
          selectedId,
          {
            phoneme:
              phoneme.trim(),
            english:
              english.trim(),
            hint:
              hint.trim() ||
              null,
            wordListId:
              selectedListId,
          },
        );

        setMessage(
          "Phoneme word updated successfully.",
        );
      } else {
        await createWord({
          phoneme:
            phoneme.trim(),
          english:
            english.trim(),
          hint:
            hint.trim() ||
            null,
          wordListId:
            selectedListId,
        });

        setMessage(
          "Phoneme word created successfully.",
        );
      }

      setSelectedId("");
      setPhoneme("");
      setEnglish("");
      setHint("");

      await loadData();

      onChanged();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save phoneme word.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    word: WordEntry,
  ) {
    const confirmed =
      window.confirm(
        `Delete ${word.phoneme} (${word.english})?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteWord(
        word.id,
      );

      if (
        selectedId ===
        word.id
      ) {
        clearForm();
      }

      await loadData();

      setMessage(
        "Phoneme word deleted successfully.",
      );

      onChanged();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete phoneme word.",
      );
    }
  }

  return (
    <section className="builderCard">
      <div className="managerHeading">
        <div>
          <h3>
            Phoneme Words
          </h3>

          <p className="mutedText">
            Add and maintain the phoneme words stored inside each list.
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
            New Word
          </button>
        )}
      </div>

      <div className="formGroup">
        <label htmlFor="wordListFilter">
          Word list
        </label>

        <select
          id="wordListFilter"
          value={
            selectedListId
          }
          onChange={(event) => {
            setSelectedListId(
              event.target.value,
            );

            if (selectedId) {
              clearForm();
            }
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
                {wordList.name}
              </option>
            ),
          )}
        </select>
      </div>

      <form
        onSubmit={
          handleSubmit
        }
      >
        <div className="formGroup">
          <label htmlFor="managePhoneme">
            Phoneme
          </label>

          <input
            id="managePhoneme"
            type="text"
            maxLength={100}
            value={phoneme}
            onChange={(event) => {
              setPhoneme(
                event.target.value,
              );
            }}
            placeholder="/θɪn/"
          />
        </div>

        <div className="formGroup">
          <label htmlFor="manageEnglish">
            English equivalent
          </label>

          <input
            id="manageEnglish"
            type="text"
            maxLength={100}
            value={english}
            onChange={(event) => {
              setEnglish(
                event.target.value,
              );
            }}
            placeholder="thin"
          />
        </div>

        <div className="formGroup">
          <label htmlFor="manageHint">
            Hint
          </label>

          <input
            id="manageHint"
            type="text"
            maxLength={250}
            value={hint}
            onChange={(event) => {
              setHint(
                event.target.value,
              );
            }}
            placeholder="TH as in thin"
          />
        </div>

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
              ? "Update Word"
              : "Add Word"}
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
            Loading phoneme words...
          </p>
        )}

        {!loading &&
          filteredWords.length ===
            0 && (
            <p className="mutedText">
              No words are stored in this list yet.
            </p>
          )}

        {filteredWords.map(
          (word) => (
            <article
              className="managerItem"
              key={
                word.id
              }
            >
              <div>
                <strong>
                  {word.phoneme}
                </strong>

                <p className="managerWordEnglish">
                  {word.english}
                </p>

                {word.hint && (
                  <small className="mutedText">
                    {word.hint}
                  </small>
                )}
              </div>

              <div className="managerActions">
                <button
                  type="button"
                  className="secondaryButton compactButton"
                  onClick={() => {
                    selectWord(
                      word,
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
                      word,
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