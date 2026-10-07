"use client";

import {
  useEffect,
  useState,
} from "react";

import WordlePreview from "@/components/wordle/WordlePreview";
import WordleSettings from "@/components/wordle/WordleSettings";
import {
  downloadWordleHtml,
} from "@/lib/wordle/generator";
import {
  getActivities,
} from "@/services/api";
import type {
  Activity,
} from "@/types/api";

type UsageEventType =
  | "GENERATION_ATTEMPTED"
  | "GENERATION_SUCCEEDED"
  | "GENERATION_FAILED";

async function recordGenerationEvent(
  eventType: UsageEventType,
  activityId: string,
  metadata?: Record<string, unknown>,
) {
  try {
    await fetch("/api/usage-events", {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        eventType,
        activityType: "WORDLE",
        activityId:
          activityId || undefined,
        success:
          eventType ===
          "GENERATION_SUCCEEDED"
            ? true
            : eventType ===
                "GENERATION_FAILED"
              ? false
              : undefined,
        metadata,
      }),
    });
  } catch (eventError) {
    console.error(
      "Failed to record Wordle generation event:",
      eventError,
    );
  }
}

export default function WordlePage() {
  const [
    activities,
    setActivities,
  ] = useState<Activity[]>([]);

  const [
    selectedActivityId,
    setSelectedActivityId,
  ] = useState("");

  const [
    phonemeWord,
    setPhonemeWord,
  ] = useState("/θɪn/");

  const [
    englishWord,
    setEnglishWord,
  ] = useState("thin");

  const [
    maxGuesses,
    setMaxGuesses,
  ] = useState(5);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  function applyActivity(
    activity: Activity,
  ) {
    const answerRelation =
      activity.words.find(
        (word) =>
          word.isAnswer,
      ) ??
      activity.words[0];

    if (
      !answerRelation
    ) {
      setError(
        "The selected activity does not have an assigned answer word.",
      );

      return;
    }

    setError("");

    setPhonemeWord(
      answerRelation
        .wordEntry
        .phoneme,
    );

    setEnglishWord(
      answerRelation
        .wordEntry
        .english,
    );

    setMaxGuesses(
      activity.maxGuesses ??
        5,
    );
  }

  useEffect(() => {
    async function loadActivities() {
      try {
        const result =
          await getActivities();

        const wordleActivities =
          result.filter(
            (activity) =>
              activity.type ===
              "WORDLE",
          );

        setActivities(
          wordleActivities,
        );

        if (
          wordleActivities.length >
          0
        ) {
          const firstActivity =
            wordleActivities[0];

          setSelectedActivityId(
            firstActivity.id,
          );

          applyActivity(
            firstActivity,
          );
        }
      } catch (
        loadError
      ) {
        setError(
          loadError instanceof
            Error
            ? loadError.message
            : "Failed to load saved activities.",
        );
      } finally {
        setLoading(
          false,
        );
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

    if (
      activity
    ) {
      applyActivity(
        activity,
      );
    }
  }

  async function handleGenerate() {
    setError("");

    await recordGenerationEvent(
      "GENERATION_ATTEMPTED",
      selectedActivityId,
      {
        maxGuesses,
      },
    );

    try {
      if (
        !phonemeWord.trim() ||
        !englishWord.trim()
      ) {
        throw new Error(
          "A phoneme word and English word are required before generation.",
        );
      }

      downloadWordleHtml({
        phonemeWord,
        englishWord,
        maxGuesses,
      });

      await recordGenerationEvent(
        "GENERATION_SUCCEEDED",
        selectedActivityId,
        {
          maxGuesses,
        },
      );
    } catch (
      generationError
    ) {
      const message =
        generationError instanceof
          Error
          ? generationError.message
          : "Failed to generate the Wordle activity.";

      setError(
        message,
      );

      await recordGenerationEvent(
        "GENERATION_FAILED",
        selectedActivityId,
        {
          reason:
            message,
          maxGuesses,
        },
      );
    }
  }

  const previewKey =
    `${selectedActivityId}-${phonemeWord}-${englishWord}-${maxGuesses}`;

  return (
    <section>
      <div className="page-heading">
        <h2>
          Wordle Builder
        </h2>

        <p>
          Load a saved phoneme
          activity from the
          database, preview it,
          adjust its settings,
          and generate a
          standalone HTML
          activity.
        </p>
      </div>

      <div className="builderLayout">
        <WordleSettings
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
          phonemeWord={
            phonemeWord
          }
          englishWord={
            englishWord
          }
          maxGuesses={
            maxGuesses
          }
          onActivityChange={
            handleActivityChange
          }
          onPhonemeChange={
            setPhonemeWord
          }
          onEnglishChange={
            setEnglishWord
          }
          onMaxGuessesChange={
            setMaxGuesses
          }
          onGenerate={
            handleGenerate
          }
        />

        <WordlePreview
          key={
            previewKey
          }
          phonemeWord={
            phonemeWord
          }
          englishWord={
            englishWord
          }
          maxGuesses={
            maxGuesses
          }
        />
      </div>
    </section>
  );
}