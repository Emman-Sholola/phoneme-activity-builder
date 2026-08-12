"use client";

import { useMemo, useState } from "react";

type WordEntry = {
  phoneme: string;
  english: string;
};

type Coordinate = {
  row: number;
  column: number;
};

type Placement = {
  row: number;
  column: number;
  rowDirection: number;
  columnDirection: number;
};

const gridSize = 12;

const placements: Placement[] = [
  {
    row: 1,
    column: 1,
    rowDirection: 0,
    columnDirection: 1,
  },
  {
    row: 2,
    column: 3,
    rowDirection: 1,
    columnDirection: 0,
  },
  {
    row: 4,
    column: 1,
    rowDirection: 1,
    columnDirection: 1,
  },
  {
    row: 9,
    column: 1,
    rowDirection: 0,
    columnDirection: 1,
  },
  {
    row: 1,
    column: 10,
    rowDirection: 1,
    columnDirection: 0,
  },
];

const fillerSymbols = [
  "p",
  "b",
  "t",
  "d",
  "k",
  "g",
  "f",
  "v",
  "s",
  "z",
  "m",
  "n",
  "l",
  "r",
  "θ",
  "ɪ",
  "æ",
  "ʌ",
  "ɒ",
  "ʃ",
];

function normalisePhoneme(value: string) {
  return value
    .trim()
    .replace(/^\/|\/$/g, "")
    .toLowerCase();
}

function getSymbols(value: string) {
  return Array.from(
    normalisePhoneme(value),
  );
}

function createGrid(
  words: WordEntry[],
) {
  const grid = Array.from(
    { length: gridSize },
    (_, row) =>
      Array.from(
        { length: gridSize },
        (_, column) =>
          fillerSymbols[
            (
              row * gridSize +
              column
            ) %
              fillerSymbols.length
          ],
      ),
  );

  words.forEach(
    (entry, index) => {
      const placement =
        placements[index];

      if (!placement) {
        return;
      }

      const symbols =
        getSymbols(
          entry.phoneme,
        );

      symbols.forEach(
        (
          symbol,
          symbolIndex,
        ) => {
          const row =
            placement.row +
            placement.rowDirection *
              symbolIndex;

          const column =
            placement.column +
            placement.columnDirection *
              symbolIndex;

          if (
            row >= 0 &&
            row < gridSize &&
            column >= 0 &&
            column < gridSize
          ) {
            grid[row][column] =
              symbol;
          }
        },
      );
    },
  );

  return grid;
}

function getSelectedCoordinates(
  start: Coordinate,
  end: Coordinate,
) {
  const rowDifference =
    end.row - start.row;

  const columnDifference =
    end.column - start.column;

  const validLine =
    rowDifference === 0 ||
    columnDifference === 0 ||
    Math.abs(
      rowDifference,
    ) ===
      Math.abs(
        columnDifference,
      );

  if (!validLine) {
    return [];
  }

  const rowDirection =
    Math.sign(
      rowDifference,
    );

  const columnDirection =
    Math.sign(
      columnDifference,
    );

  const length =
    Math.max(
      Math.abs(
        rowDifference,
      ),
      Math.abs(
        columnDifference,
      ),
    ) + 1;

  return Array.from(
    { length },
    (_, index) => ({
      row:
        start.row +
        rowDirection *
          index,

      column:
        start.column +
        columnDirection *
          index,
    }),
  );
}

export default function WordSearchPage() {
  const [words, setWords] =
    useState<WordEntry[]>([
      {
        phoneme: "/θɪn/",
        english: "thin",
      },
      {
        phoneme: "/kæt/",
        english: "cat",
      },
      {
        phoneme: "/dɒg/",
        english: "dog",
      },
      {
        phoneme: "/fɪʃ/",
        english: "fish",
      },
      {
        phoneme: "/sʌn/",
        english: "sun",
      },
    ]);

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

  const grid = useMemo(() => {
    return createGrid(words);
  }, [words]);

  function updateWord(
    index: number,
    field: keyof WordEntry,
    value: string,
  ) {
    const updatedWords = [
      ...words,
    ];

    updatedWords[index] = {
      ...updatedWords[index],
      [field]: value,
    };

    setWords(
      updatedWords,
    );

    resetPreview();
  }

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
        setFoundWords([
          ...foundWords,
          target,
        ]);

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

  function generateHtml() {
    const safeWords =
      JSON.stringify(words);

    const safeGrid =
      JSON.stringify(grid);

    const safeGridSize =
      JSON.stringify(
        gridSize,
      );

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>Phoneme Word Search</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 2rem;
      font-family: Arial, Helvetica, sans-serif;
      background: #f7f7f8;
      color: #1b1b1d;
    }

    main {
      width: min(850px, 100%);
      margin: 0 auto;
    }

    .card {
      padding: 2rem;
      border: 1px solid #d8d8dc;
      border-radius: 12px;
      background: #ffffff;
    }

    .grid {
      display: grid;
      grid-template-columns:
        repeat(${safeGridSize}, 1fr);
      gap: 0.25rem;
      margin: 1.5rem 0;
    }

    .cell {
      display: flex;
      aspect-ratio: 1;
      align-items: center;
      justify-content: center;
      min-width: 0;
      padding: 0;
      border: 1px solid #bdbdc2;
      border-radius: 4px;
      background: #ffffff;
      color: #1b1b1d;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
    }

    .cell:hover {
      background: #eeeeef;
    }

    .cell:focus {
      outline: 3px solid #1b1b1d;
      outline-offset: 2px;
    }

    .cell.selected {
      background: #39875b;
      color: #ffffff;
    }

    .wordList {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      padding: 0;
      list-style: none;
    }

    .wordItem {
      padding: 0.6rem 0.8rem;
      border: 1px solid #d8d8dc;
      border-radius: 8px;
      background: #f7f7f8;
      font-weight: 600;
      cursor: help;
    }

    .wordItem.found {
      background: #39875b;
      color: #ffffff;
      text-decoration: line-through;
    }

    .message {
      min-height: 1.5rem;
      margin-top: 1rem;
      font-weight: 700;
    }

    .progress {
      margin-top: 1rem;
    }

    @media (max-width: 650px) {
      body {
        padding: 1rem;
      }

      .card {
        padding: 1rem;
      }

      .grid {
        gap: 0.15rem;
      }

      .cell {
        font-size: 0.75rem;
      }
    }
  </style>
</head>

<body>
  <main>
    <section class="card">
      <h1>
        Phoneme Word Search
      </h1>

      <p>
        Find each phoneme word in the grid.
        Select its first symbol and then its final symbol.
      </p>

      <h2>
        Words to Find
      </h2>

      <ul
        id="wordList"
        class="wordList"
      ></ul>

      <div
        id="grid"
        class="grid"
        aria-label="Phoneme word search grid"
      ></div>

      <div
        id="message"
        class="message"
        aria-live="polite"
      >
        Select the first and last symbol of a word.
      </div>

      <p class="progress">
        Found:
        <strong id="progress">
          0 / ${words.length}
        </strong>
      </p>
    </section>
  </main>

  <script>
    const words = ${safeWords};
    const gridData = ${safeGrid};

    const gridElement =
      document.getElementById(
        "grid"
      );

    const wordList =
      document.getElementById(
        "wordList"
      );

    const message =
      document.getElementById(
        "message"
      );

    const progress =
      document.getElementById(
        "progress"
      );

    let selectionStart = null;
    let selectedCells = [];
    let foundWords = [];

    function normalisePhoneme(
      value
    ) {
      let result =
        value.trim();

      if (
        result.startsWith("/")
      ) {
        result =
          result.slice(1);
      }

      if (
        result.endsWith("/")
      ) {
        result =
          result.slice(
            0,
            -1
          );
      }

      return result.toLowerCase();
    }

    function getSelectedCoordinates(
      start,
      end
    ) {
      const rowDifference =
        end.row -
        start.row;

      const columnDifference =
        end.column -
        start.column;

      const validLine =
        rowDifference === 0 ||
        columnDifference === 0 ||
        Math.abs(
          rowDifference
        ) ===
          Math.abs(
            columnDifference
          );

      if (!validLine) {
        return [];
      }

      const rowDirection =
        Math.sign(
          rowDifference
        );

      const columnDirection =
        Math.sign(
          columnDifference
        );

      const length =
        Math.max(
          Math.abs(
            rowDifference
          ),
          Math.abs(
            columnDifference
          )
        ) + 1;

      return Array.from(
        {
          length: length
        },
        function (
          _,
          index
        ) {
          return {
            row:
              start.row +
              rowDirection *
                index,

            column:
              start.column +
              columnDirection *
                index
          };
        }
      );
    }

    function coordinateKey(
      row,
      column
    ) {
      return (
        row +
        ":" +
        column
      );
    }

    function updateGridSelection() {
      document
        .querySelectorAll(
          ".cell"
        )
        .forEach(
          function (
            cell
          ) {
            cell.classList.remove(
              "selected"
            );
          }
        );

      selectedCells.forEach(
        function (
          coordinate
        ) {
          const cell =
            document.querySelector(
              '[data-key="' +
                coordinateKey(
                  coordinate.row,
                  coordinate.column
                ) +
                '"]'
            );

          if (cell) {
            cell.classList.add(
              "selected"
            );
          }
        }
      );
    }

    function updateWordList() {
      wordList.innerHTML =
        "";

      words.forEach(
        function (
          entry
        ) {
          const item =
            document.createElement(
              "li"
            );

          const target =
            normalisePhoneme(
              entry.phoneme
            );

          item.className =
            "wordItem" +
            (
              foundWords.includes(
                target
              )
                ? " found"
                : ""
            );

          item.textContent =
            entry.phoneme;

          item.title =
            entry.english;

          wordList.appendChild(
            item
          );
        }
      );

      progress.textContent =
        foundWords.length +
        " / " +
        words.length;
    }

    function handleCellClick(
      row,
      column
    ) {
      const coordinate = {
        row: row,
        column: column
      };

      if (
        !selectionStart
      ) {
        selectionStart =
          coordinate;

        selectedCells = [
          coordinate
        ];

        updateGridSelection();

        message.textContent =
          "Now select the final symbol of the word.";

        return;
      }

      const coordinates =
        getSelectedCoordinates(
          selectionStart,
          coordinate
        );

      if (
        coordinates.length ===
        0
      ) {
        selectionStart =
          null;

        selectedCells =
          [];

        updateGridSelection();

        message.textContent =
          "Words must be selected in a straight line. Try again.";

        return;
      }

      const selectedWord =
        coordinates
          .map(
            function (
              cell
            ) {
              return gridData[
                cell.row
              ][
                cell.column
              ];
            }
          )
          .join("");

      const reversedWord =
        Array.from(
          selectedWord
        )
          .reverse()
          .join("");

      const matchedWord =
        words.find(
          function (
            entry
          ) {
            const target =
              normalisePhoneme(
                entry.phoneme
              );

            return (
              target ===
                selectedWord ||
              target ===
                reversedWord
            );
          }
        );

      selectedCells =
        coordinates;

      selectionStart =
        null;

      updateGridSelection();

      if (matchedWord) {
        const target =
          normalisePhoneme(
            matchedWord.phoneme
          );

        if (
          !foundWords.includes(
            target
          )
        ) {
          foundWords.push(
            target
          );

          updateWordList();

          message.textContent =
            "Found " +
            matchedWord.phoneme +
            ', meaning "' +
            matchedWord.english +
            '".';

          if (
            foundWords.length ===
            words.length
          ) {
            message.textContent =
              "Great work. You found all of the phoneme words.";
          }
        } else {
          message.textContent =
            "You have already found that word.";
        }

        return;
      }

      message.textContent =
        "That selection is not one of the target words.";
    }

    gridData.forEach(
      function (
        row,
        rowIndex
      ) {
        row.forEach(
          function (
            symbol,
            columnIndex
          ) {
            const button =
              document.createElement(
                "button"
              );

            button.type =
              "button";

            button.className =
              "cell";

            button.textContent =
              symbol;

            button.dataset.key =
              coordinateKey(
                rowIndex,
                columnIndex
              );

            button.setAttribute(
              "aria-label",
              "Row " +
                (
                  rowIndex +
                  1
                ) +
                ", column " +
                (
                  columnIndex +
                  1
                ) +
                ", symbol " +
                symbol
            );

            button.addEventListener(
              "click",
              function () {
                handleCellClick(
                  rowIndex,
                  columnIndex
                );
              }
            );

            gridElement.appendChild(
              button
            );
          }
        );
      }
    );

    updateWordList();
  </script>
</body>
</html>`;

    const blob = new Blob(
      [html],
      {
        type: "text/html",
      },
    );

    const url =
      URL.createObjectURL(
        blob,
      );

    const link =
      document.createElement(
        "a",
      );

    link.href = url;

    link.download =
      "phonemeWordSearch.html";

    document.body.appendChild(
      link,
    );

    link.click();

    document.body.removeChild(
      link,
    );

    URL.revokeObjectURL(
      url,
    );
  }

  return (
    <section>
      <div className="page-heading">
        <h2>
          Word Search Builder
        </h2>

        <p>
          Configure a small phoneme word list,
          preview the activity, then generate a
          standalone HTML file.
        </p>
      </div>

      <div className="builderLayout">
        <section className="builderCard">
          <h3>
            Activity Settings
          </h3>

          <p className="mutedText">
            Enter five short phoneme words and
            their English equivalents.
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
                      onChange={(
                        event,
                      ) => {
                        updateWord(
                          index,
                          "phoneme",
                          event.target
                            .value,
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
                      onChange={(
                        event,
                      ) => {
                        updateWord(
                          index,
                          "english",
                          event.target
                            .value,
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
            onClick={generateHtml}
          >
            Generate HTML
          </button>
        </section>

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
            onClick={resetPreview}
          >
            Reset Preview
          </button>
        </section>
      </div>
    </section>
  );
}