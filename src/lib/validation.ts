export type WordListInput = {
  name?: unknown;
  description?: unknown;
};

export type ValidatedWordList = {
  name?: string;
  description?: string | null;
};

export type WordEntryInput = {
  phoneme?: unknown;
  english?: unknown;
  hint?: unknown;
  wordListId?: unknown;
};

export type ValidatedWordEntry = {
  phoneme?: string;
  english?: string;
  hint?: string | null;
  wordListId?: string;
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

export function validateWordEntryInput(
  input: WordEntryInput,
  requireAllFields: boolean,
): {
  data?: ValidatedWordEntry;
  error?: string;
} {
  const data: ValidatedWordEntry = {};

  if (
    requireAllFields &&
    input.phoneme === undefined
  ) {
    return {
      error: "Phoneme is required.",
    };
  }

  if (
    requireAllFields &&
    input.english === undefined
  ) {
    return {
      error: "English equivalent is required.",
    };
  }

  if (
    requireAllFields &&
    input.wordListId === undefined
  ) {
    return {
      error: "Word list ID is required.",
    };
  }

  if (input.phoneme !== undefined) {
    if (typeof input.phoneme !== "string") {
      return {
        error: "Phoneme must be a string.",
      };
    }

    const phoneme = input.phoneme.trim();

    if (!phoneme) {
      return {
        error: "Phoneme cannot be empty.",
      };
    }

    if (phoneme.length > 100) {
      return {
        error:
          "Phoneme must be 100 characters or fewer.",
      };
    }

    data.phoneme = phoneme;
  }

  if (input.english !== undefined) {
    if (typeof input.english !== "string") {
      return {
        error:
          "English equivalent must be a string.",
      };
    }

    const english = input.english.trim();

    if (!english) {
      return {
        error:
          "English equivalent cannot be empty.",
      };
    }

    if (english.length > 100) {
      return {
        error:
          "English equivalent must be 100 characters or fewer.",
      };
    }

    data.english = english;
  }

  if (input.hint !== undefined) {
    if (
      input.hint !== null &&
      typeof input.hint !== "string"
    ) {
      return {
        error:
          "Hint must be a string or null.",
      };
    }

    if (typeof input.hint === "string") {
      const hint = input.hint.trim();

      if (hint.length > 250) {
        return {
          error:
            "Hint must be 250 characters or fewer.",
        };
      }

      data.hint =
        hint || null;
    } else {
      data.hint = null;
    }
  }

  if (input.wordListId !== undefined) {
    if (typeof input.wordListId !== "string") {
      return {
        error:
          "Word list ID must be a string.",
      };
    }

    const wordListId =
      input.wordListId.trim();

    if (!wordListId) {
      return {
        error:
          "Word list ID cannot be empty.",
      };
    }

    data.wordListId = wordListId;
  }

  return {
    data,
  };
}