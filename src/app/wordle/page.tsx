"use client";

import { useMemo, useState } from "react";

type SymbolResult = {
  symbol: string;
  status: "correct" | "present" | "absent";
};

const phonemeHints: Record<string, string> = {
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

function normalisePhoneme(value: string) {
  return value
    .trim()
    .replace(/^\/|\/$/g, "")
    .toLowerCase();
}

function getSymbols(value: string) {
  return Array.from(normalisePhoneme(value));
}

function compareGuess(
  guessValue: string,
  answerValue: string,
): SymbolResult[] {
  const guessSymbols = getSymbols(guessValue);
  const answerSymbols = getSymbols(answerValue);

  const results: SymbolResult[] = [];
  const remainingAnswer = [...answerSymbols];

  guessSymbols.forEach((symbol, index) => {
    if (symbol === answerSymbols[index]) {
      results[index] = {
        symbol,
        status: "correct",
      };

      remainingAnswer[index] = "";
    }
  });

  guessSymbols.forEach((symbol, index) => {
    if (results[index]) {
      return;
    }

    const matchIndex = remainingAnswer.indexOf(symbol);

    if (matchIndex !== -1) {
      results[index] = {
        symbol,
        status: "present",
      };

      remainingAnswer[matchIndex] = "";
    } else {
      results[index] = {
        symbol,
        status: "absent",
      };
    }
  });

  return results;
}

export default function WordlePage() {
  const [phonemeWord, setPhonemeWord] = useState("/θɪn/");
  const [englishWord, setEnglishWord] = useState("thin");
  const [maxGuesses, setMaxGuesses] = useState(5);

  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<SymbolResult[][]>([]);
  const [message, setMessage] = useState("");
  const [solved, setSolved] = useState(false);

  const answerSymbols = useMemo(() => {
    return getSymbols(phonemeWord);
  }, [phonemeWord]);

  const guessesRemaining = Math.max(
    maxGuesses - guesses.length,
    0,
  );

  function resetGame() {
    setGuess("");
    setGuesses([]);
    setMessage("");
    setSolved(false);
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (solved || guessesRemaining === 0) {
      return;
    }

    const cleanedGuess = normalisePhoneme(guess);

    if (!cleanedGuess) {
      setMessage("Enter a phoneme guess first.");
      return;
    }

    if (
      getSymbols(cleanedGuess).length !==
      answerSymbols.length
    ) {
      setMessage(
        `Your guess needs ${answerSymbols.length} phoneme symbols.`,
      );

      return;
    }

    const result = compareGuess(
      cleanedGuess,
      phonemeWord,
    );

    const updatedGuesses = [
      ...guesses,
      result,
    ];

    setGuesses(updatedGuesses);
    setGuess("");

    if (
      cleanedGuess ===
      normalisePhoneme(phonemeWord)
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

  function generateHtml() {
    const safePhoneme =
      JSON.stringify(phonemeWord);

    const safeEnglish =
      JSON.stringify(englishWord);

    const safeMaxGuesses =
      JSON.stringify(maxGuesses);

    const safeHints =
      JSON.stringify(phonemeHints);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>Phoneme Wordle Activity</title>

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
      width: min(700px, 100%);
      margin: 0 auto;
    }

    .card {
      padding: 2rem;
      border: 1px solid #d8d8dc;
      border-radius: 12px;
      background: #ffffff;
    }

    .hiddenSlots,
    .guessRow {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin: 1rem 0;
    }

    .slot {
      display: flex;
      width: 3rem;
      height: 3rem;
      align-items: center;
      justify-content: center;
      border: 2px solid #c8c8cc;
      border-radius: 8px;
      font-size: 1.3rem;
      font-weight: 700;
    }

    .correct {
      border-color: #39875b;
      background: #39875b;
      color: #ffffff;
    }

    .present {
      border-color: #b18b2e;
      background: #b18b2e;
      color: #ffffff;
    }

    .absent {
      border-color: #6b6b70;
      background: #6b6b70;
      color: #ffffff;
    }

    .hintList {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin: 1rem 0 1.5rem;
    }

    .hint {
      padding: 0.6rem 0.8rem;
      border: 1px solid #c8c8cc;
      border-radius: 8px;
      background: #eeeeef;
      color: #1b1b1d;
      font-weight: 600;
      cursor: help;
    }

    .hint:focus {
      outline: 3px solid #1b1b1d;
      outline-offset: 2px;
    }

    form {
      margin-top: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }

    .controls {
      display: flex;
      gap: 0.75rem;
    }

    input,
    button {
      font: inherit;
    }

    input {
      flex: 1;
      padding: 0.8rem;
      border: 1px solid #bdbdc2;
      border-radius: 8px;
    }

    button {
      padding: 0.8rem 1rem;
      border: 1px solid #1b1b1d;
      border-radius: 8px;
      background: #1b1b1d;
      color: #ffffff;
      cursor: pointer;
      font-weight: 700;
    }

    button:disabled,
    input:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    .message {
      min-height: 1.5rem;
      margin-top: 1rem;
      font-weight: 700;
    }

    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1rem;
      font-size: 0.9rem;
    }

    .legendItem {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .legendColour {
      width: 1rem;
      height: 1rem;
      border-radius: 3px;
    }

    @media (max-width: 600px) {
      body {
        padding: 1rem;
      }

      .card {
        padding: 1.25rem;
      }

      .controls {
        flex-direction: column;
      }

      .slot {
        width: 2.7rem;
        height: 2.7rem;
      }
    }
  </style>
</head>

<body>
  <main>
    <section class="card">
      <h1>Phoneme Wordle</h1>

      <p>
        Guess the hidden phoneme word using the sound hints below.
      </p>

      <div
        id="hiddenSlots"
        class="hiddenSlots"
        aria-label="Hidden phoneme word"
      ></div>

      <h2>Sound Hints</h2>

      <div
        id="hintList"
        class="hintList"
      ></div>

      <p>
        Hover over or focus a hint to see its sound equivalence.
      </p>

      <div class="legend">
        <span class="legendItem">
          <span class="legendColour correct"></span>
          Correct position
        </span>

        <span class="legendItem">
          <span class="legendColour present"></span>
          Wrong position
        </span>

        <span class="legendItem">
          <span class="legendColour absent"></span>
          Not in answer
        </span>
      </div>

      <p>
        Guesses remaining:
        <strong id="remaining"></strong>
      </p>

      <form id="gameForm">
        <label for="guessInput">
          Enter phoneme guess
        </label>

        <div class="controls">
          <input
            id="guessInput"
            type="text"
            autocomplete="off"
            required
            placeholder="Example: /θɪn/"
          >

          <button type="submit">
            Submit Guess
          </button>
        </div>
      </form>

      <div
        id="message"
        class="message"
        aria-live="polite"
      ></div>

      <div id="guessHistory"></div>
    </section>
  </main>

  <script>
    const answer = ${safePhoneme};
    const englishWord = ${safeEnglish};
    const maxGuesses = ${safeMaxGuesses};
    const hints = ${safeHints};

    const form =
      document.getElementById("gameForm");

    const input =
      document.getElementById("guessInput");

    const submitButton =
      form.querySelector("button");

    const message =
      document.getElementById("message");

    const remaining =
      document.getElementById("remaining");

    const hiddenSlots =
      document.getElementById("hiddenSlots");

    const hintList =
      document.getElementById("hintList");

    const guessHistory =
      document.getElementById("guessHistory");

    let guessCount = 0;
    let solved = false;

    function normalisePhoneme(value) {
      let result = value.trim();

      if (result.startsWith("/")) {
        result = result.slice(1);
      }

      if (result.endsWith("/")) {
        result = result.slice(0, -1);
      }

      return result.toLowerCase();
    }

    function getSymbols(value) {
      return Array.from(
        normalisePhoneme(value)
      );
    }

    function compareGuess(
      guessValue,
      answerValue
    ) {
      const guessSymbols =
        getSymbols(guessValue);

      const answerSymbols =
        getSymbols(answerValue);

      const results = [];

      const remainingAnswer = [
        ...answerSymbols,
      ];

      guessSymbols.forEach(
        function (symbol, index) {
          if (
            symbol ===
            answerSymbols[index]
          ) {
            results[index] = {
              symbol: symbol,
              status: "correct",
            };

            remainingAnswer[index] = "";
          }
        }
      );

      guessSymbols.forEach(
        function (symbol, index) {
          if (results[index]) {
            return;
          }

          const matchIndex =
            remainingAnswer.indexOf(
              symbol
            );

          if (matchIndex !== -1) {
            results[index] = {
              symbol: symbol,
              status: "present",
            };

            remainingAnswer[
              matchIndex
            ] = "";
          } else {
            results[index] = {
              symbol: symbol,
              status: "absent",
            };
          }
        }
      );

      return results;
    }

    function createSlots() {
      hiddenSlots.innerHTML = "";

      getSymbols(answer).forEach(
        function () {
          const slot =
            document.createElement(
              "span"
            );

          slot.className = "slot";
          slot.textContent = "?";

          hiddenSlots.appendChild(
            slot
          );
        }
      );
    }

    function createHints() {
      hintList.innerHTML = "";

      getSymbols(answer).forEach(
        function (symbol) {
          const hint =
            document.createElement(
              "span"
            );

          hint.className = "hint";
          hint.tabIndex = 0;
          hint.textContent =
            "/" + symbol + "/";

          hint.title =
            hints[symbol] ||
            "Phoneme sound";

          hintList.appendChild(
            hint
          );
        }
      );
    }

    function updateRemaining() {
      remaining.textContent =
        Math.max(
          maxGuesses - guessCount,
          0
        );
    }

    function addGuessRow(results) {
      const row =
        document.createElement(
          "div"
        );

      row.className = "guessRow";

      results.forEach(
        function (result) {
          const slot =
            document.createElement(
              "span"
            );

          slot.className =
            "slot " +
            result.status;

          slot.textContent =
            result.symbol;

          row.appendChild(slot);
        }
      );

      guessHistory.appendChild(
        row
      );
    }

    function revealAnswer() {
      hiddenSlots.innerHTML = "";

      getSymbols(answer).forEach(
        function (symbol) {
          const slot =
            document.createElement(
              "span"
            );

          slot.className =
            "slot correct";

          slot.textContent =
            symbol;

          hiddenSlots.appendChild(
            slot
          );
        }
      );
    }

    function finishGame() {
      input.disabled = true;
      submitButton.disabled = true;
    }

    form.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();

        if (
          solved ||
          guessCount >= maxGuesses
        ) {
          return;
        }

        const value =
          input.value.trim();

        const cleanValue =
          normalisePhoneme(value);

        const answerSymbols =
          getSymbols(answer);

        if (!cleanValue) {
          message.textContent =
            "Enter a phoneme guess first.";

          return;
        }

        if (
          getSymbols(
            cleanValue
          ).length !==
          answerSymbols.length
        ) {
          message.textContent =
            "Your guess needs " +
            answerSymbols.length +
            " phoneme symbols.";

          return;
        }

        guessCount += 1;

        const result =
          compareGuess(
            cleanValue,
            answer
          );

        addGuessRow(result);

        input.value = "";

        if (
          cleanValue ===
          normalisePhoneme(answer)
        ) {
          solved = true;

          revealAnswer();

          message.textContent =
            "Correct. " +
            answer +
            ' represents the English word "' +
            englishWord +
            '".';

          updateRemaining();
          finishGame();

          return;
        }

        if (
          guessCount >=
          maxGuesses
        ) {
          revealAnswer();

          message.textContent =
            "No guesses remaining. The answer was " +
            answer +
            ', meaning "' +
            englishWord +
            '".';

          updateRemaining();
          finishGame();

          return;
        }

        message.textContent =
          "Not quite. Use the feedback and try again.";

        updateRemaining();
        input.focus();
      }
    );

    createSlots();
    createHints();
    updateRemaining();
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
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "phonemeWordle.html";

    document.body.appendChild(
      link,
    );

    link.click();

    document.body.removeChild(
      link,
    );

    URL.revokeObjectURL(url);
  }

  return (
    <section>
      <div className="page-heading">
        <h2>
          Wordle Builder
        </h2>

        <p>
          Configure a phoneme based Wordle activity,
          preview it, then generate a standalone HTML file.
        </p>
      </div>

      <div className="builderLayout">
        <section className="builderCard">
          <h3>
            Activity Settings
          </h3>

          <div className="formGroup">
            <label htmlFor="phonemeWord">
              Phoneme answer
            </label>

            <input
              id="phonemeWord"
              type="text"
              value={phonemeWord}
              onChange={(event) => {
                setPhonemeWord(
                  event.target.value,
                );

                resetGame();
              }}
            />

            <small>
              Example: /θɪn/
            </small>
          </div>

          <div className="formGroup">
            <label htmlFor="englishWord">
              English equivalent
            </label>

            <input
              id="englishWord"
              type="text"
              value={englishWord}
              onChange={(event) => {
                setEnglishWord(
                  event.target.value,
                );

                resetGame();
              }}
            />

            <small>
              Example: thin
            </small>
          </div>

          <div className="formGroup">
            <label htmlFor="maxGuesses">
              Number of guesses
            </label>

            <input
              id="maxGuesses"
              type="number"
              min="1"
              max="10"
              value={maxGuesses}
              onChange={(event) => {
                const value =
                  Number(
                    event.target.value,
                  );

                const nextValue =
                  Math.max(
                    1,
                    Math.min(
                      10,
                      value || 1,
                    ),
                  );

                setMaxGuesses(
                  nextValue,
                );

                resetGame();
              }}
            />
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
            Guess the hidden phoneme word
            using the sound hints below.
          </p>

          <div
            className="hiddenSlots"
            aria-label="Hidden phoneme word"
          >
            {answerSymbols.map(
              (symbol, index) => (
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
              (symbol, index) => (
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
                          {
                            item.symbol
                          }
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
      </div>
    </section>
  );
}