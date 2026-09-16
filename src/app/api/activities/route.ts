import { NextResponse } from "next/server";

import {
  Prisma,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

type ActivityInput = {
  name?: unknown;
  description?: unknown;
  type?: unknown;
  difficulty?: unknown;
  maxGuesses?: unknown;
  gridSize?: unknown;
  wordListId?: unknown;
  settings?: unknown;
};

const activityTypes = [
  "WORDLE",
  "WORD_SEARCH",
] as const;

const difficulties = [
  "EASY",
  "MEDIUM",
  "HARD",
] as const;

function getJsonValue(
  value: unknown,
):
  | Prisma.InputJsonValue
  | typeof Prisma.JsonNull
  | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return Prisma.JsonNull;
  }

  return value as Prisma.InputJsonValue;
}

export async function GET() {
  try {
    const activities =
      await prisma.activity.findMany({
        include: {
          wordList: true,
          words: {
            include: {
              wordEntry: true,
            },
            orderBy: {
              position: "asc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(
      activities,
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Failed to retrieve activities:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to retrieve activities.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(
  request: Request,
) {
  try {
    let body: ActivityInput;

    try {
      body =
        (await request.json()) as ActivityInput;
    } catch {
      return NextResponse.json(
        {
          error:
            "Request body must contain valid JSON.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      typeof body.name !== "string" ||
      !body.name.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Activity name is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      typeof body.type !== "string" ||
      !activityTypes.includes(
        body.type as
          (typeof activityTypes)[number],
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Activity type must be WORDLE or WORD_SEARCH.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      body.difficulty !== undefined &&
      (
        typeof body.difficulty !==
          "string" ||
        !difficulties.includes(
          body.difficulty as
            (typeof difficulties)[number],
        )
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Difficulty must be EASY, MEDIUM, or HARD.",
        },
        {
          status: 400,
        },
      );
    }

    const wordListId =
      typeof body.wordListId ===
        "string" &&
      body.wordListId.trim()
        ? body.wordListId.trim()
        : null;

    if (wordListId) {
      const wordList =
        await prisma.wordList.findUnique({
          where: {
            id: wordListId,
          },
        });

      if (!wordList) {
        return NextResponse.json(
          {
            error:
              "Word list not found.",
          },
          {
            status: 404,
          },
        );
      }
    }

    if (
      body.maxGuesses !== undefined &&
      (
        typeof body.maxGuesses !==
          "number" ||
        !Number.isInteger(
          body.maxGuesses,
        ) ||
        body.maxGuesses < 1 ||
        body.maxGuesses > 20
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Max guesses must be an integer between 1 and 20.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      body.gridSize !== undefined &&
      (
        typeof body.gridSize !==
          "number" ||
        !Number.isInteger(
          body.gridSize,
        ) ||
        body.gridSize < 5 ||
        body.gridSize > 30
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Grid size must be an integer between 5 and 30.",
        },
        {
          status: 400,
        },
      );
    }

    const activity =
      await prisma.activity.create({
        data: {
          name:
            body.name.trim(),

          description:
            typeof body.description ===
              "string"
              ? body.description.trim() ||
                null
              : null,

          type:
            body.type as
              | "WORDLE"
              | "WORD_SEARCH",

          difficulty:
            typeof body.difficulty ===
              "string"
              ? body.difficulty as
                  | "EASY"
                  | "MEDIUM"
                  | "HARD"
              : "MEDIUM",

          maxGuesses:
            typeof body.maxGuesses ===
              "number"
              ? body.maxGuesses
              : null,

          gridSize:
            typeof body.gridSize ===
              "number"
              ? body.gridSize
              : null,

          wordListId,

          settings:
            getJsonValue(
              body.settings,
            ),
        },

        include: {
          wordList: true,
          words: {
            include: {
              wordEntry: true,
            },
          },
        },
      });

    return NextResponse.json(
      activity,
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Failed to create activity:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to create activity.",
      },
      {
        status: 500,
      },
    );
  }
}