import {
  expect,
  test,
} from "@playwright/test";

test("teacher can load a stored Wordle activity and generate HTML", async ({
  page,
}) => {
  await page.goto(
    "/wordle",
  );

  await expect(
    page.getByRole(
      "heading",
      {
        name:
          "Wordle Builder",
      },
    ),
  ).toBeVisible();

  const activitySelect =
    page.getByLabel(
      "Saved Wordle Activity",
    );

  await expect(
    activitySelect,
  ).toBeEnabled();

  await expect
    .poll(
      async () =>
        activitySelect.inputValue(),
    )
    .not.toBe("");

  const phonemeInput =
    page.getByLabel(
      "Phoneme answer",
    );

  const englishInput =
    page.getByLabel(
      "English equivalent",
    );

  const guessesInput =
    page.getByLabel(
      "Number of guesses",
    );

  await expect(
    phonemeInput,
  ).not.toHaveValue("");

  await expect(
    englishInput,
  ).not.toHaveValue("");

  await expect(
    guessesInput,
  ).toHaveValue(
    /.+/,
  );

  const generateButton =
    page.getByRole(
      "button",
      {
        name:
          "Generate HTML",
      },
    );

  await expect(
    generateButton,
  ).toBeEnabled();

  const [
    download,
  ] =
    await Promise.all([
      page.waitForEvent(
        "download",
      ),

      generateButton.click(),
    ]);

  expect(
    download
      .suggestedFilename()
      .toLowerCase(),
  ).toMatch(
    /\.html$/,
  );

  expect(
    await download.failure(),
  ).toBeNull();
});