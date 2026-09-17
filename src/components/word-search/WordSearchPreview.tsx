"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  createGrid,
  getSelectedCoordinates,
  normalisePhoneme,
  type Coordinate,
  type WordSearchWord,
} from "@/lib/word-search/game";

type WordSearchPreviewProps = {
  words: WordSearchWord[];
  gridSize: number;
};

export default function WordSearchPreview({
  words,
  gridSize,
}: WordSearchPreviewProps) {
  const [
    selectionStart,
    setSelectionStart,
  ] =
    useState<Coordinate | null>(
      null,
    );

  const [
    selectedCells,
    setSelectedCells,
  ] =
    useState<Coordinate[]>([]);

  const [
    foundWords,
    setFoundWords,
  ] =
    useState<string[]>([]);

  const [
    message,
    setMessage,
  ] = useState(
    "Select the first and last symbol of a word.",
  );

  const grid =
    useMemo(() => {
      return createGrid(
        words,
        gridSize,
      );
    }, [words, gridSize]);

  function resetPreview() {
    setSelectionStart(
      null,
    );

    setSelectedCells(
      [],
    );

    setFoundWords(
      [],
    );

    setMessage(
      "Select the first and last symbol of a word.",
    );
  }

  function isSelected(
    row: number,
    column: number,
  ) {
    return selectedCells.some(
      (coordinate) =>
        coordinate.row ===
          row &&
        coordinate.column ===
          column,
    );
  }

  function handleCellClick(
    row: number,
    column: number,
  ) {
    const coordinate = {
      row,
      column,
    };

    if (!selectionStart) {
      setSelectionStart(
        coordinate,
      );

      setSelectedCells([
        coordinate,
      ]);

      setMessage(
        "Now select the final symbol of the word.",
      );

      return;
    }

    const coordinates =
      getSelectedCoordinates(
        selectionStart,
        coordinate,
      );

    if (
      coordinates.length === 0
    ) {
      setSelectionStart(
        null,
      );

      setSelectedCells(
        [],
      );

      setMessage(
        "Words must be selected in a straight line. Try again.",
      );

      return;
    }

    const selectedWord =
      coordinates
        .map(
          (cell) =>
            grid[
              cell.row
            ][cell.column],
        )
        .join("");

    const reversedWord =
      Array.from(
        selectedWord,
      )
        .reverse()
        .join("");

    const matchedWord =
      words.find(
        (entry) => {
          const target =
            normalisePhoneme(
              entry.phoneme,
            );

          return (
            target ===
              selectedWord ||
            target ===
              reversedWord
          );
        },
      );

    setSelectedCells(
      coordinates,
    );

    setSelectionStart(
      null,
    );

    if (matchedWord) {
      const target =
        normalisePhoneme(
          matchedWord.phoneme,
        );

      if (
        !foundWords.includes(
          target,
        )
      ) {
        const updatedFoundWords = [
          ...foundWords,
          target,
        ];

        setFoundWords(
          updatedFoundWords,
        );

        if (
          updatedFoundWords.length ===
          words.length
        ) {
          setMessage(
            "Great work. You found all of the phoneme words.",
          );

          return;
        }

        setMessage(
          `Found ${matchedWord.phoneme}, meaning "${matchedWord.english}".`,
        );
      } else {
        setMessage(
          "You have already found that word.",
        );
      }

      return;
    }

    setMessage(
      "That selection is not one of the target words.",
    );
  }

  return (
    <section className="builderCard">
      <h3>
        Playable Preview
      </h3>

      <p>
        Find each phoneme word in the grid.
        Select its first symbol and then its
        final symbol.
      </p>

      <h4>
        Words to Find
      </h4>

      <ul className="wordTargetList">
        {words.map(
          (
            entry,
            index,
          ) => {
            const target =
              normalisePhoneme(
                entry.phoneme,
              );

            const found =
              foundWords.includes(
                target,
              );

            return (
              <li
                className={
                  found
                    ? "wordTarget foundWord"
                    : "wordTarget"
                }
                title={
                  entry.english
                }
                key={`target${index}`}
              >
                {entry.phoneme}
              </li>
            );
          },
        )}
      </ul>

      <div
        className="wordSearchGrid"
        aria-label="Phoneme word search grid"
        style={{
          gridTemplateColumns:
            `repeat(${gridSize}, 1fr)`,
        }}
      >
        {grid.map(
          (
            row,
            rowIndex,
          ) =>
            row.map(
              (
                symbol,
                columnIndex,
              ) => (
                <button
                  type="button"
                  className={
                    isSelected(
                      rowIndex,
                      columnIndex,
                    )
                      ? "wordSearchCell selectedCell"
                      : "wordSearchCell"
                  }
                  key={`${rowIndex}${columnIndex}`}
                  onClick={() => {
                    handleCellClick(
                      rowIndex,
                      columnIndex,
                    );
                  }}
                  aria-label={`Row ${
                    rowIndex + 1
                  }, column ${
                    columnIndex +
                    1
                  }, symbol ${symbol}`}
                >
                  {symbol}
                </button>
              ),
            ),
        )}
      </div>

      <div
        className="gameMessage"
        aria-live="polite"
      >
        {message}
      </div>

      <p>
        Found:{" "}
        <strong>
          {
            foundWords.length
          }{" "}
          / {words.length}
        </strong>
      </p>

      <button
        type="button"
        className="secondaryButton"
        onClick={
          resetPreview
        }
      >
        Reset Preview
      </button>
    </section>
  );
}