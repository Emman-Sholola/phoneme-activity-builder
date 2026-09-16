import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  type WordListInput,
  validateWordListInput,
} from "@/lib/validation";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext,
) {
  try {
    const { id } =
      await context.params;

    const wordList =
      await prisma.wordList.findUnique({
        where: {
          id,
        },
        include: {
          words: {
            orderBy: {
              createdAt: "asc",
            },
          },
          activities: true,
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

    return NextResponse.json(
      wordList,
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Failed to retrieve word list:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to retrieve word list.",
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

    const existingWordList =
      await prisma.wordList.findUnique({
        where: {
          id,
        },
      });

    if (!existingWordList) {
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

    let body: WordListInput;

    try {
      body =
        (await request.json()) as WordListInput;
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
      body.name === undefined &&
      body.description === undefined
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

    const validation =
      validateWordListInput(
        body,
        false,
      );

    if (
      validation.error ||
      !validation.data
    ) {
      return NextResponse.json(
        {
          error:
            validation.error ??
            "Invalid word list data.",
        },
        {
          status: 400,
        },
      );
    }

    const updatedWordList =
      await prisma.wordList.update({
        where: {
          id,
        },
        data:
          validation.data,
        include: {
          words: true,
        },
      });

    return NextResponse.json(
      updatedWordList,
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Failed to update word list:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to update word list.",
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

    const existingWordList =
      await prisma.wordList.findUnique({
        where: {
          id,
        },
        include: {
          activities: true,
        },
      });

    if (!existingWordList) {
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

    await prisma.wordList.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        message:
          "Word list deleted successfully.",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Failed to delete word list:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete word list.",
      },
      {
        status: 500,
      },
    );
  }
}