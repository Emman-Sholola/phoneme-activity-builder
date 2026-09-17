"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import WordSearchPreview from "@/components/word-search/WordSearchPreview";
import WordSearchSettings from "@/components/word-search/WordSearchSettings";
import {
  createGrid,
  type WordSearchWord,
} from "@/lib/word-search/game";
import {
  downloadWordSearchHtml,
} from "@/lib/word-search/generator";
import {
  getActivities,
} from "@/services/api";
import type {
  Activity,
} from "@/types/api";

function getActivityWords(
  activity: Activity,
): WordSearchWord[] {
  return activity.words.map(
    (relation) => ({
      phoneme:
        relation.wordEntry
          .phoneme,

      english:
        relation.wordEntry
          .english,
    }),
  );
}

export default function WordSearchPage() {
  const [
    activities,
    setActivities,
  ] =
    useState<Activity[]>([]);

  const [
    selectedActivityId,
    setSelectedActivityId,
  ] =
    useState("");

  const [
    words,
    setWords,
  ] =
    useState<WordSearchWord[]>(
      [],
    );

  const [
    gridSize,
    setGridSize,
  ] =
    useState(12);

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

  const grid =
    useMemo(() => {
      return createGrid(
        words,
        gridSize,
      );
    }, [words, gridSize]);

  useEffect(() => {
    async function loadActivities() {
      try {
        const result =
          await getActivities();

        const wordSearchActivities =
          result.filter(
            (activity) =>
              activity.type ===
              "WORD_SEARCH",
          );

        setActivities(
          wordSearchActivities,
        );

        if (
          wordSearchActivities.length >
          0
        ) {
          const firstActivity =
            wordSearchActivities[0];

          const activityWords =
            getActivityWords(
              firstActivity,
            );

          setSelectedActivityId(
            firstActivity.id,
          );

          setWords(
            activityWords,
          );

          setGridSize(
            firstActivity.gridSize ??
              12,
          );

          if (
            activityWords.length ===
            0
          ) {
            setError(
              "The selected activity does not contain any words.",
            );
          }
        }
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load saved activities.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadActivities();
  }, []);

  function handleActivityChange(
    activityId: string,
  ) {
    setSelectedActivityId(
      activityId,
    );

    const activity =
      activities.find(
        (item) =>
          item.id ===
          activityId,
      );

    if (!activity) {
      return;
    }

    const activityWords =
      getActivityWords(
        activity,
      );

    setWords(
      activityWords,
    );

    setGridSize(
      activity.gridSize ??
        12,
    );

    if (
      activityWords.length ===
      0
    ) {
      setError(
        "The selected activity does not contain any words.",
      );
    } else {
      setError("");
    }
  }

  function handleWordChange(
    index: number,
    field:
      keyof WordSearchWord,
    value: string,
  ) {
    setWords(
      (currentWords) =>
        currentWords.map(
          (
            word,
            wordIndex,
          ) =>
            wordIndex === index
              ? {
                  ...word,
                  [field]:
                    value,
                }
              : word,
        ),
    );
  }

  function handleGenerate() {
    downloadWordSearchHtml({
      words,
      grid,
      gridSize,
    });
  }

  const previewKey =
    `${selectedActivityId}-${gridSize}-${JSON.stringify(words)}`;

  return (
    <section>
      <div className="page-heading">
        <h2>
          Word Search Builder
        </h2>

        <p>
          Load a saved phoneme activity from the database,
          preview its stored word list, adjust its settings,
          and generate a standalone HTML activity.
        </p>
      </div>

      <div className="builderLayout">
        <WordSearchSettings
          activities={
            activities
          }
          selectedActivityId={
            selectedActivityId
          }
          loading={
            loading
          }
          error={
            error
          }
          words={
            words
          }
          gridSize={
            gridSize
          }
          onActivityChange={
            handleActivityChange
          }
          onWordChange={
            handleWordChange
          }
          onGridSizeChange={
            setGridSize
          }
          onGenerate={
            handleGenerate
          }
        />

        <WordSearchPreview
          key={
            previewKey
          }
          words={
            words
          }
          gridSize={
            gridSize
          }
        />
      </div>
    </section>
  );
}