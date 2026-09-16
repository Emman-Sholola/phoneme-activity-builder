import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  type WordListInput,
  validateWordListInput,
} from "@/lib/validation";

export async function GET() {
  try {
    const wordLists =
      await prisma.wordList.findMany({
        include: {
          words: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(
      wordLists,
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Failed to retrieve word lists:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to retrieve word lists.",
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

    const validation =
      validateWordListInput(
        body,
        true,
      );

    if (
      validation.error ||
      !validation.data?.name
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

    const wordList =
      await prisma.wordList.create({
        data: {
          name: validation.data.name,
          description:
            validation.data.description ??
            null,
        },
        include: {
          words: true,
        },
      });

    return NextResponse.json(
      wordList,
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Failed to create word list:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to create word list.",
      },
      {
        status: 500,
      },
    );
  }
}