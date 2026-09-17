import type {
  WordSearchWord,
} from "@/lib/word-search/game";

type WordSearchGenerationOptions = {
  words: WordSearchWord[];
  grid: string[][];
  gridSize: number;
};

export function downloadWordSearchHtml({
  words,
  grid,
  gridSize,
}: WordSearchGenerationOptions) {
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
      min-width: 0;
      align-items: center;
      justify-content: center;
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

      if (!selectionStart) {
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