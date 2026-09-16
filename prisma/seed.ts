import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

type SeededWord = {
  id: string;
  phoneme: string;
  english: string;
  hint: string | null;
  wordListId: string;
  createdAt: Date;
  updatedAt: Date;
};

async function main() {
  await prisma.activityWord.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.wordEntry.deleteMany();
  await prisma.wordList.deleteMany();

  const beginnerWords = await prisma.wordList.create({
    data: {
      name: "Beginner Phoneme Words",
      description:
        "A starter collection of short phoneme based words for classroom activities.",
      words: {
        create: [
          {
            phoneme: "/θɪn/",
            english: "thin",
            hint: "TH as in thin",
          },
          {
            phoneme: "/kæt/",
            english: "cat",
            hint: "Short A as in cat",
          },
          {
            phoneme: "/dɒg/",
            english: "dog",
            hint: "Short O as in dog",
          },
          {
            phoneme: "/fɪʃ/",
            english: "fish",
            hint: "SH as in fish",
          },
          {
            phoneme: "/sʌn/",
            english: "sun",
            hint: "Short U as in sun",
          },
        ],
      },
    },
    include: {
      words: true,
    },
  });

  const seededWords =
    beginnerWords.words as SeededWord[];

  const thinWord = seededWords.find(
    (word: SeededWord) =>
      word.phoneme === "/θɪn/",
  );

  if (!thinWord) {
    throw new Error(
      "Seed word /θɪn/ was not created.",
    );
  }

  await prisma.activity.create({
    data: {
      name: "TH Wordle Practice",
      description:
        "A beginner Wordle activity using the phoneme word thin.",
      type: "WORDLE",
      difficulty: "EASY",
      maxGuesses: 5,
      wordListId: beginnerWords.id,
      words: {
        create: {
          wordEntryId: thinWord.id,
          position: 1,
          isAnswer: true,
        },
      },
    },
  });

  await prisma.activity.create({
    data: {
      name: "Beginner Word Search",
      description:
        "A phoneme Word Search using five beginner words.",
      type: "WORD_SEARCH",
      difficulty: "EASY",
      gridSize: 12,
      wordListId: beginnerWords.id,
      words: {
        create: seededWords.map(
          (
            word: SeededWord,
            index: number,
          ) => ({
            wordEntryId: word.id,
            position: index + 1,
            isAnswer: false,
          }),
        ),
      },
    },
  });

  console.log(
    "Database seeded successfully.",
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });