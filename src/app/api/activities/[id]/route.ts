import { NextResponse } from "next/server";

import {
  Prisma,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type ActivityUpdateInput = {
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

export async function GET(
  request: Request,
  context: RouteContext,
) {
  try {
    const { id } =
      await context.params;

    const activity =
      await prisma.activity.findUnique({
        where: {
          id,
        },
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
      });

    if (!activity) {
      return NextResponse.json(
        {
          error:
            "Activity not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      activity,
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Failed to retrieve activity:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to retrieve activity.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PUT(
  request: Request,
  context: RouteContext,
) {
  try {
    const { id } =
      await context.params;

    const existingActivity =
      await prisma.activity.findUnique({
        where: {
          id,
        },
      });

    if (!existingActivity) {
      return NextResponse.json(
        {
          error:
            "Activity not found.",
        },
        {
          status: 404,
        },
      );
    }

    let body: ActivityUpdateInput;

    try {
      body =
        (await request.json()) as ActivityUpdateInput;
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
      Object.keys(body).length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Provide at least one field to update.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      body.name !== undefined &&
      (
        typeof body.name !==
          "string" ||
        !body.name.trim()
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Activity name cannot be empty.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      body.type !== undefined &&
      (
        typeof body.type !==
          "string" ||
        !activityTypes.includes(
          body.type as
            (typeof activityTypes)[number],
        )
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

    if (
      body.maxGuesses !== undefined &&
      body.maxGuesses !== null &&
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
      body.gridSize !== null &&
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

    let wordListRelation:
      | {
          connect: {
            id: string;
          };
        }
      | {
          disconnect: true;
        }
      | undefined;

    if (
      body.wordListId !== undefined
    ) {
      if (
        body.wordListId === null
      ) {
        wordListRelation = {
          disconnect: true,
        };
      } else if (
        typeof body.wordListId ===
          "string" &&
        body.wordListId.trim()
      ) {
        const wordListId =
          body.wordListId.trim();

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

        wordListRelation = {
          connect: {
            id: wordListId,
          },
        };
      } else {
        return NextResponse.json(
          {
            error:
              "Word list ID must be a valid string or null.",
          },
          {
            status: 400,
          },
        );
      }
    }

    const updateData:
      Prisma.ActivityUpdateInput = {
        ...(typeof body.name ===
        "string"
          ? {
              name:
                body.name.trim(),
            }
          : {}),

        ...(body.description !==
        undefined
          ? {
              description:
                typeof body.description ===
                  "string"
                  ? body.description.trim() ||
                    null
                  : null,
            }
          : {}),

        ...(typeof body.type ===
        "string"
          ? {
              type:
                body.type as
                  | "WORDLE"
                  | "WORD_SEARCH",
            }
          : {}),

        ...(typeof body.difficulty ===
        "string"
          ? {
              difficulty:
                body.difficulty as
                  | "EASY"
                  | "MEDIUM"
                  | "HARD",
            }
          : {}),

        ...(body.maxGuesses !==
        undefined
          ? {
              maxGuesses:
                body.maxGuesses as
                  number | null,
            }
          : {}),

        ...(body.gridSize !==
        undefined
          ? {
              gridSize:
                body.gridSize as
                  number | null,
            }
          : {}),

        ...(wordListRelation
          ? {
              wordList:
                wordListRelation,
            }
          : {}),

        ...(body.settings !==
        undefined
          ? {
              settings:
                getJsonValue(
                  body.settings,
                ),
            }
          : {}),
      };

    const updatedActivity =
      await prisma.activity.update({
        where: {
          id,
        },

        data:
          updateData,

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
      });

    return NextResponse.json(
      updatedActivity,
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Failed to update activity:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to update activity.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext,
) {
  try {
    const { id } =
      await context.params;

    const existingActivity =
      await prisma.activity.findUnique({
        where: {
          id,
        },
      });

    if (!existingActivity) {
      return NextResponse.json(
        {
          error:
            "Activity not found.",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.activity.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        message:
          "Activity deleted successfully.",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Failed to delete activity:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete activity.",
      },
      {
        status: 500,
      },
    );
  }
}