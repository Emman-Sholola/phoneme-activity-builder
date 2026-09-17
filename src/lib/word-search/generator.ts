type WordSearchWord = {
  phoneme: string;
  english: string;
};

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
    JSON.stringify(gridSize);

  const currentTheme =
    document.documentElement
      .dataset.theme === "dark"
      ? "dark"
      : "light";

  const html = `<!DOCTYPE html>
<html
  lang="en"
  data-theme="${currentTheme}"
>
<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>
    Phoneme Word Search Activity
  </title>

  <style>
    :root {
      color-scheme: light;

      --background: #f7f7f8;
      --surface: #ffffff;
      --text: #1b1b1d;
      --muted: #5f6268;
      --border: #bdbdc2;
      --cell-background: #ffffff;
      --hover-background: #eeeeef;
      --word-background: #f7f7f8;
      --focus: #1b1b1d;
    }

    html[data-theme="dark"] {
      color-scheme: dark;

      --background: #0f0f10;
      --surface: #171718;
      --text: #f5f5f5;
      --muted: #c7c7c7;
      --border: #444448;
      --cell-background: #0f0f10;
      --hover-background: #242426;
      --word-background: #242426;
      --focus: #f5f5f5;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 2rem;
      font-family:
        Arial,
        Helvetica,
        sans-serif;
      background:
        var(--background);
      color:
        var(--text);
    }

    main {
      width:
        min(
          800px,
          100%
        );
      margin:
        0 auto;
    }

    .card {
      padding:
        2rem;
      border:
        1px solid
        var(--border);
      border-radius:
        12px;
      background:
        var(--surface);
    }

    h1,
    h2 {
      color:
        var(--text);
    }

    p {
      line-height:
        1.5;
    }

    .instructions {
      color:
        var(--muted);
    }

    .grid {
      display:
        grid;

      grid-template-columns:
        repeat(
          ${safeGridSize},
          1fr
        );

      gap:
        0.25rem;

      margin:
        1.5rem 0;
    }

    .cell {
      display:
        flex;

      aspect-ratio:
        1;

      align-items:
        center;

      justify-content:
        center;

      min-width:
        0;

      padding:
        0;

      border:
        1px solid
        var(--border);

      border-radius:
        4px;

      background:
        var(--cell-background);

      color:
        var(--text);

      font-size:
        1rem;

      font-weight:
        700;

      cursor:
        pointer;
    }

    .cell:hover {
      background:
        var(--hover-background);
    }

    .cell:focus-visible {
      outline:
        3px solid
        var(--focus);

      outline-offset:
        2px;
    }

    .cell.selected {
      border-color:
        #39875b;

      background:
        #39875b;

      color:
        #ffffff;
    }

    .wordList {
      display:
        flex;

      flex-wrap:
        wrap;

      gap:
        0.75rem;

      padding:
        0;

      list-style:
        none;
    }

    .wordItem {
      padding:
        0.6rem
        0.8rem;

      border:
        1px solid
        var(--border);

      border-radius:
        8px;

      background:
        var(--word-background);

      color:
        var(--text);
    }

    .wordItem.found {
      border-color:
        #39875b;

      background:
        #39875b;

      color:
        #ffffff;

      text-decoration:
        line-through;
    }

    .message {
      min-height:
        1.5rem;

      margin-top:
        1rem;

      font-weight:
        700;
    }

    @media (
      max-width: 650px
    ) {
      body {
        padding:
          1rem;
      }

      .card {
        padding:
          1rem;
      }

      .grid {
        gap:
          0.15rem;
      }

      .cell {
        font-size:
          0.75rem;
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

      <p class="instructions">
        Find each phoneme word
        in the grid.
        Select its first symbol
        and then its final symbol.
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
        Select the first and
        last symbol of a word.
      </div>
    </section>
  </main>

  <script>
    const words =
      ${safeWords};

    const gridData =
      ${safeGrid};

    const gridSize =
      ${safeGridSize};

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

    let selectionStart =
      null;

    let selectedCells =
      [];

    let foundWords =
      [];

    function normalisePhoneme(
      value
    ) {
      let result =
        value
          .trim()
          .toLowerCase();

      if (
        result.startsWith(
          "/"
        )
      ) {
        result =
          result.slice(
            1
          );
      }

      if (
        result.endsWith(
          "/"
        )
      ) {
        result =
          result.slice(
            0,
            -1
          );
      }

      return result;
    }

    function coordinateKey(
      row,
      column
    ) {
      return (
        row +
        "-" +
        column
      );
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

      if (
        !validLine
      ) {
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
          length:
            length
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

    function updateGridSelection() {
      const buttons =
        gridElement
          .querySelectorAll(
            ".cell"
          );

      buttons.forEach(
        function (
          button
        ) {
          const key =
            button
              .dataset
              .key;

          const selected =
            selectedCells.some(
              function (
                coordinate
              ) {
                return (
                  coordinateKey(
                    coordinate.row,
                    coordinate.column
                  ) ===
                  key
                );
              }
            );

          button
            .classList
            .toggle(
              "selected",
              selected
            );
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
            document
              .createElement(
                "li"
              );

          const target =
            normalisePhoneme(
              entry.phoneme
            );

          item.className =
            "wordItem";

          if (
            foundWords.includes(
              target
            )
          ) {
            item
              .classList
              .add(
                "found"
              );
          }

          item.textContent =
            entry.phoneme +
            " (" +
            entry.english +
            ")";

          wordList
            .appendChild(
              item
            );
        }
      );
    }

    function handleCellClick(
      row,
      column
    ) {
      const coordinate = {
        row:
          row,

        column:
          column
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
          .join(
            ""
          );

      const reversedWord =
        Array.from(
          selectedWord
        )
          .reverse()
          .join(
            ""
          );

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

      if (
        matchedWord
      ) {
        const target =
          normalisePhoneme(
            matchedWord
              .phoneme
          );

        if (
          !foundWords
            .includes(
              target
            )
        ) {
          foundWords
            .push(
              target
            );

          updateWordList();

          message.textContent =
            "Found " +
            matchedWord
              .phoneme +
            ', meaning "' +
            matchedWord
              .english +
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
              document
                .createElement(
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

            button
              .addEventListener(
                "click",
                function () {
                  handleCellClick(
                    rowIndex,
                    columnIndex
                  );
                }
              );

            gridElement
              .appendChild(
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

  const blob =
    new Blob(
      [html],
      {
        type:
          "text/html",
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

  link.href =
    url;

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