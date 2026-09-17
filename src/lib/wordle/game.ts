export type SymbolResult = {
  symbol: string;
  status: "correct" | "present" | "absent";
};

export const phonemeHints: Record<string, string> = {
  θ: "TH as in thin",
  ð: "TH as in this",
  ɪ: "I as in sit",
  i: "EE as in see",
  ɛ: "E as in bed",
  æ: "A as in cat",
  ʌ: "U as in cup",
  ɑ: "A as in father",
  ɒ: "O as in hot",
  ɔ: "OR as in thought",
  ʊ: "OO as in book",
  u: "OO as in food",
  ə: "A as in about",
  ɜ: "ER as in bird",
  p: "P as in pen",
  b: "B as in bat",
  t: "T as in top",
  d: "D as in dog",
  k: "K as in cat",
  g: "G as in go",
  f: "F as in fish",
  v: "V as in van",
  s: "S as in sun",
  z: "Z as in zoo",
  ʃ: "SH as in ship",
  ʒ: "S as in vision",
  h: "H as in hat",
  m: "M as in man",
  n: "N as in net",
  ŋ: "NG as in sing",
  l: "L as in leg",
  r: "R as in red",
  j: "Y as in yes",
  w: "W as in wet",
};

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

export function compareGuess(
  guessValue: string,
  answerValue: string,
): SymbolResult[] {
  const guessSymbols =
    getSymbols(guessValue);

  const answerSymbols =
    getSymbols(answerValue);

  const results:
    SymbolResult[] = [];

  const remainingAnswer = [
    ...answerSymbols,
  ];

  guessSymbols.forEach(
    (symbol, index) => {
      if (
        symbol ===
        answerSymbols[index]
      ) {
        results[index] = {
          symbol,
          status: "correct",
        };

        remainingAnswer[index] =
          "";
      }
    },
  );

  guessSymbols.forEach(
    (symbol, index) => {
      if (results[index]) {
        return;
      }

      const matchIndex =
        remainingAnswer.indexOf(
          symbol,
        );

      if (matchIndex !== -1) {
        results[index] = {
          symbol,
          status: "present",
        };

        remainingAnswer[
          matchIndex
        ] = "";
      } else {
        results[index] = {
          symbol,
          status: "absent",
        };
      }
    },
  );

  return results;
}