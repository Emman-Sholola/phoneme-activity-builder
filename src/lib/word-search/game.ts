export type WordSearchWord = {
  phoneme: string;
  english: string;
};

export type Coordinate = {
  row: number;
  column: number;
};

type Direction = {
  row: number;
  column: number;
};

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

const directions: Direction[] = [
  {
    row: 0,
    column: 1,
  },
  {
    row: 1,
    column: 0,
  },
  {
    row: 1,
    column: 1,
  },
  {
    row: 0,
    column: -1,
  },
  {
    row: 1,
    column: -1,
  },
];

export function normalisePhoneme(
  value: string,
) {
  return value
    .trim()
    .replace(/^\/|\/$/g, "")
    .toLowerCase();
}

export function getSymbols(
  value: string,
) {
  return Array.from(
    normalisePhoneme(value),
  );
}

function canPlaceWord(
  grid: (string | null)[][],
  symbols: string[],
  startRow: number,
  startColumn: number,
  direction: Direction,
  gridSize: number,
) {
  return symbols.every(
    (symbol, index) => {
      const row =
        startRow +
        direction.row * index;

      const column =
        startColumn +
        direction.column * index;

      if (
        row < 0 ||
        row >= gridSize ||
        column < 0 ||
        column >= gridSize
      ) {
        return false;
      }

      const existing =
        grid[row][column];

      return (
        existing === null ||
        existing === symbol
      );
    },
  );
}

function placeWord(
  grid: (string | null)[][],
  symbols: string[],
  startRow: number,
  startColumn: number,
  direction: Direction,
) {
  symbols.forEach(
    (symbol, index) => {
      const row =
        startRow +
        direction.row * index;

      const column =
        startColumn +
        direction.column * index;

      grid[row][column] =
        symbol;
    },
  );
}

export function createGrid(
  words: WordSearchWord[],
  gridSize: number,
) {
  const grid:
    (string | null)[][] =
    Array.from(
      {
        length: gridSize,
      },
      () =>
        Array.from(
          {
            length: gridSize,
          },
          () => null,
        ),
    );

  words.forEach(
    (entry, wordIndex) => {
      const symbols =
        getSymbols(
          entry.phoneme,
        );

      if (
        symbols.length === 0 ||
        symbols.length > gridSize
      ) {
        return;
      }

      let placed = false;

      for (
        let directionOffset = 0;
        directionOffset <
        directions.length;
        directionOffset += 1
      ) {
        const direction =
          directions[
            (
              wordIndex +
              directionOffset
            ) %
              directions.length
          ];

        for (
          let rowOffset = 0;
          rowOffset < gridSize;
          rowOffset += 1
        ) {
          const row =
            (
              rowOffset +
              wordIndex * 2
            ) %
            gridSize;

          for (
            let columnOffset = 0;
            columnOffset <
            gridSize;
            columnOffset += 1
          ) {
            const column =
              (
                columnOffset +
                wordIndex * 3
              ) %
              gridSize;

            if (
              canPlaceWord(
                grid,
                symbols,
                row,
                column,
                direction,
                gridSize,
              )
            ) {
              placeWord(
                grid,
                symbols,
                row,
                column,
                direction,
              );

              placed = true;
              break;
            }
          }

          if (placed) {
            break;
          }
        }

        if (placed) {
          break;
        }
      }
    },
  );

  return grid.map(
    (row, rowIndex) =>
      row.map(
        (
          symbol,
          columnIndex,
        ) => {
          if (symbol !== null) {
            return symbol;
          }

          const fillerIndex =
            (
              rowIndex *
                gridSize +
              columnIndex
            ) %
            fillerSymbols.length;

          return fillerSymbols[
            fillerIndex
          ];
        },
      ),
  );
}

export function getSelectedCoordinates(
  start: Coordinate,
  end: Coordinate,
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
    {
      length,
    },
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