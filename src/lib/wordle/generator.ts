import {
  phonemeHints,
} from "@/lib/wordle/game";

type WordleGenerationOptions = {
  phonemeWord: string;
  englishWord: string;
  maxGuesses: number;
};

export function downloadWordleHtml({
  phonemeWord,
  englishWord,
  maxGuesses,
}: WordleGenerationOptions) {
  const safePhoneme =
    JSON.stringify(
      phonemeWord,
    );

  const safeEnglish =
    JSON.stringify(
      englishWord,
    );

  const safeMaxGuesses =
    JSON.stringify(
      maxGuesses,
    );

  const safeHints =
    JSON.stringify(
      phonemeHints,
    );

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
        ...answerSymbols
      ];

      guessSymbols.forEach(
        function (symbol, index) {
          if (
            symbol ===
            answerSymbols[index]
          ) {
            results[index] = {
              symbol: symbol,
              status: "correct"
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
              status: "present"
            };

            remainingAnswer[
              matchIndex
            ] = "";
          } else {
            results[index] = {
              symbol: symbol,
              status: "absent"
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
          maxGuesses -
            guessCount,
          0
        );
    }

    function addGuessRow(
      results
    ) {
      const row =
        document.createElement(
          "div"
        );

      row.className =
        "guessRow";

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

          row.appendChild(
            slot
          );
        }
      );

      guessHistory.appendChild(
        row
      );
    }

    function revealAnswer() {
      hiddenSlots.innerHTML =
        "";

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
      submitButton.disabled =
        true;
    }

    form.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();

        if (
          solved ||
          guessCount >=
            maxGuesses
        ) {
          return;
        }

        const cleanValue =
          normalisePhoneme(
            input.value
          );

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
          normalisePhoneme(
            answer
          )
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
    URL.createObjectURL(
      blob,
    );

  const link =
    document.createElement(
      "a",
    );

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

  URL.revokeObjectURL(
    url,
  );
}