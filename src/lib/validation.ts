export type WordListInput = {
  name?: unknown;
  description?: unknown;
};

export type ValidatedWordList = {
  name?: string;
  description?: string | null;
};

export function validateWordListInput(
  input: WordListInput,
  requireName: boolean,
): {
  data?: ValidatedWordList;
  error?: string;
} {
  const data: ValidatedWordList = {};

  if (requireName && input.name === undefined) {
    return {
      error: "Name is required.",
    };
  }

  if (input.name !== undefined) {
    if (typeof input.name !== "string") {
      return {
        error: "Name must be a string.",
      };
    }

    const name = input.name.trim();

    if (!name) {
      return {
        error: "Name cannot be empty.",
      };
    }

    if (name.length > 100) {
      return {
        error:
          "Name must be 100 characters or fewer.",
      };
    }

    data.name = name;
  }

  if (input.description !== undefined) {
    if (
      input.description !== null &&
      typeof input.description !== "string"
    ) {
      return {
        error:
          "Description must be a string or null.",
      };
    }

    if (typeof input.description === "string") {
      const description =
        input.description.trim();

      if (description.length > 500) {
        return {
          error:
            "Description must be 500 characters or fewer.",
        };
      }

      data.description =
        description || null;
    } else {
      data.description = null;
    }
  }

  return {
    data,
  };
}