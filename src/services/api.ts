import type {
  Activity,
  CreateActivityInput,
  CreateWordInput,
  CreateWordListInput,
  UpdateActivityInput,
  UpdateWordInput,
  UpdateWordListInput,
  WordEntry,
  WordList,
} from "@/types/api";

type ApiErrorResponse = {
  error?: string;
};

async function apiRequest<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let message =
      `Request failed with status ${response.status}.`;

    try {
      const error =
        (await response.json()) as ApiErrorResponse;

      if (error.error) {
        message = error.error;
      }
    } catch {
      // Keep the fallback error message.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

/* Word Lists */

export function getWordLists() {
  return apiRequest<WordList[]>(
    "/api/word-lists",
  );
}

export function getWordList(
  id: string,
) {
  return apiRequest<WordList>(
    `/api/word-lists/${id}`,
  );
}

export function createWordList(
  input: CreateWordListInput,
) {
  return apiRequest<WordList>(
    "/api/word-lists",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function updateWordList(
  id: string,
  input: UpdateWordListInput,
) {
  return apiRequest<WordList>(
    `/api/word-lists/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
  );
}

export function deleteWordList(
  id: string,
) {
  return apiRequest<{
    message: string;
  }>(
    `/api/word-lists/${id}`,
    {
      method: "DELETE",
    },
  );
}

/* Words */

export function getWords() {
  return apiRequest<WordEntry[]>(
    "/api/words",
  );
}

export function getWord(
  id: string,
) {
  return apiRequest<WordEntry>(
    `/api/words/${id}`,
  );
}

export function createWord(
  input: CreateWordInput,
) {
  return apiRequest<WordEntry>(
    "/api/words",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function updateWord(
  id: string,
  input: UpdateWordInput,
) {
  return apiRequest<WordEntry>(
    `/api/words/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
  );
}

export function deleteWord(
  id: string,
) {
  return apiRequest<{
    message: string;
  }>(
    `/api/words/${id}`,
    {
      method: "DELETE",
    },
  );
}

/* Activities */

export function getActivities() {
  return apiRequest<Activity[]>(
    "/api/activities",
  );
}

export function getActivity(
  id: string,
) {
  return apiRequest<Activity>(
    `/api/activities/${id}`,
  );
}

export function createActivity(
  input: CreateActivityInput,
) {
  return apiRequest<Activity>(
    "/api/activities",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function updateActivity(
  id: string,
  input: UpdateActivityInput,
) {
  return apiRequest<Activity>(
    `/api/activities/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
  );
}

export function deleteActivity(
  id: string,
) {
  return apiRequest<{
    message: string;
  }>(
    `/api/activities/${id}`,
    {
      method: "DELETE",
    },
  );
}