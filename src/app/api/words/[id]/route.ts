import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  type WordEntryInput,
  validateWordEntryInput,
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

    const word =
      await prisma.wordEntry.findUnique({
        where: {
          id,
        },
        include: {
          wordList: true,
          activities: true,
        },
      });

    if (!word) {
      return NextResponse.json(
        {
          error:
            "Word not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      word,
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Failed to retrieve word:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to retrieve word.",
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

    const existingWord =
      await prisma.wordEntry.findUnique({
        where: {
          id,
        },
      });

    if (!existingWord) {
      return NextResponse.json(
        {
          error:
            "Word not found.",
        },
        {
          status: 404,
        },
      );
    }

    let body: WordEntryInput;

    try {
      body =
        (await request.json()) as WordEntryInput;
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
      body.phoneme === undefined &&
      body.english === undefined &&
      body.hint === undefined &&
      body.wordListId === undefined
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
      validateWordEntryInput(
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
            "Invalid word data.",
        },
        {
          status: 400,
        },
      );
    }

    const targetWordListId =
      validation.data.wordListId ??
      existingWord.wordListId;

    if (validation.data.wordListId) {
      const wordList =
        await prisma.wordList.findUnique({
          where: {
            id:
              validation.data.wordListId,
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

    const targetPhoneme =
      validation.data.phoneme ??
      existingWord.phoneme;

    const duplicateWord =
      await prisma.wordEntry.findFirst({
        where: {
          wordListId:
            targetWordListId,
          phoneme:
            targetPhoneme,
          NOT: {
            id,
          },
        },
      });

    if (duplicateWord) {
      return NextResponse.json(
        {
          error:
            "This phoneme already exists in the selected word list.",
        },
        {
          status: 409,
        },
      );
    }

    const updatedWord =
      await prisma.wordEntry.update({
        where: {
          id,
        },
        data:
          validation.data,
        include: {
          wordList: true,
        },
      });

    return NextResponse.json(
      updatedWord,
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Failed to update word:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to update word.",
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

    const existingWord =
      await prisma.wordEntry.findUnique({
        where: {
          id,
        },
      });

    if (!existingWord) {
      return NextResponse.json(
        {
          error:
            "Word not found.",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.wordEntry.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        message:
          "Word deleted successfully.",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Failed to delete word:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete word.",
      },
      {
        status: 500,
      },
    );
  }
}