import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  type WordEntryInput,
  validateWordEntryInput,
} from "@/lib/validation";

export async function GET() {
  try {
    const words =
      await prisma.wordEntry.findMany({
        include: {
          wordList: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(
      words,
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Failed to retrieve words:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to retrieve words.",
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

    const validation =
      validateWordEntryInput(
        body,
        true,
      );

    if (
      validation.error ||
      !validation.data?.phoneme ||
      !validation.data.english ||
      !validation.data.wordListId
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

    const wordList =
      await prisma.wordList.findUnique({
        where: {
          id: validation.data.wordListId,
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

    const existingWord =
      await prisma.wordEntry.findFirst({
        where: {
          wordListId:
            validation.data.wordListId,
          phoneme:
            validation.data.phoneme,
        },
      });

    if (existingWord) {
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

    const word =
      await prisma.wordEntry.create({
        data: {
          phoneme:
            validation.data.phoneme,
          english:
            validation.data.english,
          hint:
            validation.data.hint ??
            null,
          wordListId:
            validation.data.wordListId,
        },
        include: {
          wordList: true,
        },
      });

    return NextResponse.json(
      word,
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Failed to create word:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to create word.",
      },
      {
        status: 500,
      },
    );
  }
}