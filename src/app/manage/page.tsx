"use client";

import {
  useState,
} from "react";

import WordListManager from "@/components/manage/WordListManager";
import WordManager from "@/components/manage/WordManager";

export default function ManagePage() {
  const [
    refreshKey,
    setRefreshKey,
  ] =
    useState(0);

  function handleChanged() {
    setRefreshKey(
      (value) =>
        value + 1,
    );
  }

  return (
    <section>
      <div className="page-heading">
        <h2>
          Manage Activity Data
        </h2>

        <p>
          Create and maintain the word lists, phoneme words,
          and saved activity configurations used by the
          activity builders.
        </p>
      </div>

      <div className="managementLayout">
        <WordListManager
          refreshKey={
            refreshKey
          }
          onChanged={
            handleChanged
          }
        />

        <WordManager
          refreshKey={
            refreshKey
          }
          onChanged={
            handleChanged
          }
        />
      </div>
    </section>
  );
}