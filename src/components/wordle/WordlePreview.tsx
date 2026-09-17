"use client";

import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  compareGuess,
  getSymbols,
  normalisePhoneme,
  phonemeHints,
  type SymbolResult,
} from "@/lib/wordle/game";

type WordlePreviewProps = {
  phonemeWord: string;
  englishWord: string;
  maxGuesses: number;
};

export default function WordlePreview({
  phonemeWord,
  englishWord,
  maxGuesses,
}: WordlePreviewProps) {
  const [guess, setGuess] =
    useState("");

  const [guesses, setGuesses] =
    useState<SymbolResult[][]>(
      [],
    );

  const [message, setMessage] =
    useState("");

  const [solved, setSolved] =
    useState(false);

  const answerSymbols =
    useMemo(() => {
      return getSymbols(
        phonemeWord,
      );
    }, [phonemeWord]);

  const guessesRemaining =
    Math.max(
      maxGuesses -
        guesses.length,
      0,
    );

  function resetGame() {
    setGuess("");
    setGuesses([]);
    setMessage("");
    setSolved(false);
  }

  function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      solved ||
      guessesRemaining === 0
    ) {
      return;
    }

    const cleanedGuess =
      normalisePhoneme(
        guess,
      );

    if (!cleanedGuess) {
      setMessage(
        "Enter a phoneme guess first.",
      );

      return;
    }

    if (
      getSymbols(
        cleanedGuess,
      ).length !==
      answerSymbols.length
    ) {
      setMessage(
        `Your guess needs ${answerSymbols.length} phoneme symbols.`,
      );

      return;
    }

    const result =
      compareGuess(
        cleanedGuess,
        phonemeWord,
      );

    const updatedGuesses = [
      ...guesses,
      result,
    ];

    setGuesses(
      updatedGuesses,
    );

    setGuess("");

    if (
      cleanedGuess ===
      normalisePhoneme(
        phonemeWord,
      )
    ) {
      setSolved(true);

      setMessage(
        `Correct. ${phonemeWord} represents the English word "${englishWord}".`,
      );

      return;
    }

    if (
      updatedGuesses.length >=
      maxGuesses
    ) {
      setMessage(
        `No guesses remaining. The answer was ${phonemeWord}, meaning "${englishWord}".`,
      );

      return;
    }

    setMessage(
      "Not quite. Use the feedback and try again.",
    );
  }

  return (
    <section className="builderCard">
      <h3>
        Playable Preview
      </h3>

      <p>
        Guess the hidden phoneme word
        using the sound hints below.
      </p>

      <div
        className="hiddenSlots"
        aria-label="Hidden phoneme word"
      >
        {answerSymbols.map(
          (
            symbol,
            index,
          ) => (
            <span
              className={`phonemeTile ${
                solved
                  ? "correctTile"
                  : ""
              }`}
              key={`${symbol}${index}`}
            >
              {solved
                ? symbol
                : "?"}
            </span>
          ),
        )}
      </div>

      <h4>
        Sound Hints
      </h4>

      <div className="soundHints">
        {answerSymbols.map(
          (
            symbol,
            index,
          ) => (
            <span
              className="soundHint"
              tabIndex={0}
              title={
                phonemeHints[
                  symbol
                ] ||
                "Phoneme sound"
              }
              key={`${symbol}Hint${index}`}
            >
              /{symbol}/
            </span>
          ),
        )}
      </div>

      <p className="mutedText">
        Hover over or focus a sound
        to see its English letter
        equivalence.
      </p>

      <div className="feedbackLegend">
        <span>
          <span
            className="legendBox correctTile"
          />

          Correct position
        </span>

        <span>
          <span
            className="legendBox presentTile"
          />

          Wrong position
        </span>

        <span>
          <span
            className="legendBox absentTile"
          />

          Not in answer
        </span>
      </div>

      <p>
        Guesses remaining:{" "}
        <strong>
          {guessesRemaining}
        </strong>
      </p>

      <form
        className="guessForm"
        onSubmit={handleSubmit}
      >
        <label htmlFor="guess">
          Enter phoneme guess
        </label>

        <div className="guessControls">
          <input
            id="guess"
            type="text"
            value={guess}
            placeholder="Example: /θɪn/"
            onChange={(event) => {
              setGuess(
                event.target.value,
              );
            }}
            disabled={
              solved ||
              guessesRemaining === 0
            }
          />

          <button
            type="submit"
            className="primaryButton"
            disabled={
              solved ||
              guessesRemaining === 0
            }
          >
            Submit
          </button>
        </div>
      </form>

      <div
        className="gameMessage"
        aria-live="polite"
      >
        {message}
      </div>

      {guesses.length > 0 && (
        <div className="guessHistory">
          <h4>
            Previous Guesses
          </h4>

          {guesses.map(
            (
              result,
              rowIndex,
            ) => (
              <div
                className="guessRow"
                key={`guess${rowIndex}`}
              >
                {result.map(
                  (
                    item,
                    columnIndex,
                  ) => (
                    <span
                      className={`phonemeTile ${
                        item.status ===
                        "correct"
                          ? "correctTile"
                          : item.status ===
                              "present"
                            ? "presentTile"
                            : "absentTile"
                      }`}
                      key={`${item.symbol}${columnIndex}`}
                    >
                      {item.symbol}
                    </span>
                  ),
                )}
              </div>
            ),
          )}
        </div>
      )}

      <button
        type="button"
        className="secondaryButton"
        onClick={resetGame}
      >
        Reset Preview
      </button>
    </section>
  );
}