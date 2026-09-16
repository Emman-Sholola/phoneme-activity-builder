-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('WORDLE', 'WORD_SEARCH');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "ActivityType" NOT NULL,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
    "maxGuesses" INTEGER,
    "gridSize" INTEGER,
    "settings" JSONB,
    "wordListId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordList" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WordList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordEntry" (
    "id" TEXT NOT NULL,
    "phoneme" TEXT NOT NULL,
    "english" TEXT NOT NULL,
    "hint" TEXT,
    "wordListId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WordEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityWord" (
    "activityId" TEXT NOT NULL,
    "wordEntryId" TEXT NOT NULL,
    "position" INTEGER,
    "isAnswer" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ActivityWord_pkey" PRIMARY KEY ("activityId","wordEntryId")
);

-- CreateIndex
CREATE INDEX "Activity_type_idx" ON "Activity"("type");

-- CreateIndex
CREATE INDEX "Activity_wordListId_idx" ON "Activity"("wordListId");

-- CreateIndex
CREATE INDEX "WordEntry_wordListId_idx" ON "WordEntry"("wordListId");

-- CreateIndex
CREATE UNIQUE INDEX "WordEntry_wordListId_phoneme_key" ON "WordEntry"("wordListId", "phoneme");

-- CreateIndex
CREATE INDEX "ActivityWord_activityId_position_idx" ON "ActivityWord"("activityId", "position");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_wordListId_fkey" FOREIGN KEY ("wordListId") REFERENCES "WordList"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordEntry" ADD CONSTRAINT "WordEntry_wordListId_fkey" FOREIGN KEY ("wordListId") REFERENCES "WordList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityWord" ADD CONSTRAINT "ActivityWord_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityWord" ADD CONSTRAINT "ActivityWord_wordEntryId_fkey" FOREIGN KEY ("wordEntryId") REFERENCES "WordEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
