import {
  expect,
  test,
} from "@playwright/test";

test("teacher can create, update, and delete a word list", async ({
  page,
}) => {
  const uniqueName =
    `Playwright List ${Date.now()}`;

  const updatedName =
    `${uniqueName} Updated`;

  await page.goto(
    "/manage",
  );

  await expect(
    page.getByRole(
      "heading",
      {
        name:
          "Word Lists",
      },
    ),
  ).toBeVisible();

  const wordListSection =
    page
      .locator(
        "section.builderCard",
      )
      .filter({
        has:
          page.getByRole(
            "heading",
            {
              name:
                "Word Lists",
            },
          ),
      });

  const nameInput =
    wordListSection.getByLabel(
      "List name",
    );

  const descriptionInput =
    wordListSection.getByLabel(
      "Description",
    );

  await nameInput.fill(
    uniqueName,
  );

  await descriptionInput.fill(
    "Created by Playwright.",
  );

  await wordListSection
    .getByRole(
      "button",
      {
        name:
          "Create Word List",
      },
    )
    .click();

  await expect(
    wordListSection.getByText(
      "Word list created successfully.",
    ),
  ).toBeVisible();

  const createdItem =
    wordListSection
      .locator(
        ".managerItem",
      )
      .filter({
        hasText:
          uniqueName,
      });

  await expect(
    createdItem,
  ).toBeVisible();

  await createdItem
    .getByRole(
      "button",
      {
        name:
          "Edit",
      },
    )
    .click();

  await expect(
    nameInput,
  ).toHaveValue(
    uniqueName,
  );

  await nameInput.fill(
    updatedName,
  );

  await descriptionInput.fill(
    "Updated by Playwright.",
  );

  await wordListSection
    .getByRole(
      "button",
      {
        name:
          "Update Word List",
      },
    )
    .click();

  await expect(
    wordListSection.getByText(
      "Word list updated successfully.",
    ),
  ).toBeVisible();

  const updatedItem =
    wordListSection
      .locator(
        ".managerItem",
      )
      .filter({
        hasText:
          updatedName,
      });

  await expect(
    updatedItem,
  ).toBeVisible();

  page.once(
    "dialog",
    async (
      dialog,
    ) => {
      expect(
        dialog.type(),
      ).toBe(
        "confirm",
      );

      await dialog.accept();
    },
  );

  await updatedItem
    .getByRole(
      "button",
      {
        name:
          "Delete",
      },
    )
    .click();

  await expect(
    wordListSection.getByText(
      "Word list deleted successfully.",
    ),
  ).toBeVisible();

  await expect(
    wordListSection
      .locator(
        ".managerItem",
      )
      .filter({
        hasText:
          updatedName,
      }),
  ).toHaveCount(
    0,
  );
});